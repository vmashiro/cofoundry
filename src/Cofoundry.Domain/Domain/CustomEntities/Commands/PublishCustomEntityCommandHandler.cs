﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cofoundry.Domain.Data;
using Cofoundry.Domain.CQS;
using Microsoft.EntityFrameworkCore;
using Cofoundry.Core.MessageAggregator;
using Cofoundry.Core;
using Cofoundry.Core.Validation;
using Cofoundry.Core.EntityFramework;

namespace Cofoundry.Domain
{
    public class PublishCustomEntityCommandHandler 
        : IAsyncCommandHandler<PublishCustomEntityCommand>
        , IIgnorePermissionCheckHandler
    {
        #region constructor

        private readonly CofoundryDbContext _dbContext;
        private readonly ICommandExecutor _commandExecutor;
        private readonly IQueryExecutor _queryExecutor;
        private readonly ICustomEntityCache _customEntityCache;
        private readonly IMessageAggregator _messageAggregator;
        private readonly IPermissionValidationService _permissionValidationService;
        private readonly ICustomEntityDefinitionRepository _customEntityDefinitionRepository;
        private readonly ITransactionScopeFactory _transactionScopeFactory;
        private readonly ICustomEntityStoredProcedures _customEntityStoredProcedures;

        public PublishCustomEntityCommandHandler(
            CofoundryDbContext dbContext,
            ICommandExecutor commandExecutor,
            IQueryExecutor queryExecutor,
            ICustomEntityCache customEntityCache,
            IMessageAggregator messageAggregator,
            IPermissionValidationService permissionValidationService,
            ICustomEntityDefinitionRepository customEntityDefinitionRepository,
            ITransactionScopeFactory transactionScopeFactory,
            ICustomEntityStoredProcedures customEntityStoredProcedures
            )
        {
            _dbContext = dbContext;
            _queryExecutor = queryExecutor;
            _commandExecutor = commandExecutor;
            _customEntityCache = customEntityCache;
            _messageAggregator = messageAggregator;
            _permissionValidationService = permissionValidationService;
            _customEntityDefinitionRepository = customEntityDefinitionRepository;
            _transactionScopeFactory = transactionScopeFactory;
            _customEntityStoredProcedures = customEntityStoredProcedures;
        }

        #endregion

        #region execution

        public async Task ExecuteAsync(PublishCustomEntityCommand command, IExecutionContext executionContext)
        {
            // Prefer draft, but update published entity if no draft (only one draft permitted)
            var version = await _dbContext
                .CustomEntityVersions
                .Include(v => v.CustomEntity)
                .Where(v => v.CustomEntityId == command.CustomEntityId && (v.WorkFlowStatusId == (int)WorkFlowStatus.Draft || v.WorkFlowStatusId == (int)WorkFlowStatus.Published))
                .OrderByDescending(v => v.WorkFlowStatusId == (int)WorkFlowStatus.Draft)
                .ThenByDescending(v => v.CreateDate)
                .FirstOrDefaultAsync();
            
            EntityNotFoundException.ThrowIfNull(version, command.CustomEntityId);

            var definition = _customEntityDefinitionRepository.GetByCode(version.CustomEntity.CustomEntityDefinitionCode);
            EntityNotFoundException.ThrowIfNull(definition, version.CustomEntity.CustomEntityDefinitionCode);

            await _permissionValidationService.EnforceCustomEntityPermissionAsync<CustomEntityPublishPermission>(definition.CustomEntityDefinitionCode);

            UpdatePublishDate(command, executionContext, version);

            if (version.WorkFlowStatusId == (int)WorkFlowStatus.Published)
            {
                // only thing we can do with a published version is update the date
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                await ValidateTitle(version, definition);

                using (var scope = _transactionScopeFactory.Create(_dbContext))
                {
                    await UpdateUrlSlugIfRequired(version, definition);
                    version.WorkFlowStatusId = (int)WorkFlowStatus.Published;
                    version.CustomEntity.PublishStatusCode = PublishStatusCode.Published;

                    await _dbContext.SaveChangesAsync();
                    await _customEntityStoredProcedures.UpdatePublishStatusQueryLookupAsync(command.CustomEntityId);

                    scope.Complete();
                }
            }

            _customEntityCache.Clear(version.CustomEntity.CustomEntityDefinitionCode, command.CustomEntityId);

            await _messageAggregator.PublishAsync(new CustomEntityPublishedMessage()
            {
                CustomEntityId = command.CustomEntityId,
                CustomEntityDefinitionCode = version.CustomEntity.CustomEntityDefinitionCode
            });
        }

        private static void UpdatePublishDate(PublishCustomEntityCommand command, IExecutionContext executionContext, CustomEntityVersion draftVersion)
        {
            if (command.PublishDate.HasValue)
            {
                draftVersion.CustomEntity.PublishDate = command.PublishDate;
            }
            else if (!draftVersion.CustomEntity.PublishDate.HasValue)
            {
                draftVersion.CustomEntity.PublishDate = executionContext.ExecutionDate;
            }
        }

        /// <summary>
        /// If the url slug is autogenerated, we need to update it only when the custom entity is published.
        /// </summary>
        private async Task UpdateUrlSlugIfRequired(CustomEntityVersion dbVersion, ICustomEntityDefinition definition)
        {
            if (!definition.AutoGenerateUrlSlug) return;
            var slug = SlugFormatter.ToSlug(dbVersion.Title);

            if (slug == dbVersion.CustomEntity.UrlSlug) return;

            var urlCommand = new UpdateCustomEntityUrlCommand()
            {
                CustomEntityId = dbVersion.CustomEntityId,
                LocaleId = dbVersion.CustomEntity.LocaleId,
                UrlSlug = slug
            };

            await _commandExecutor.ExecuteAsync(urlCommand);
        }

        private async Task ValidateTitle(CustomEntityVersion dbVersion, ICustomEntityDefinition definition)
        {
            if (!definition.ForceUrlSlugUniqueness || SlugFormatter.ToSlug(dbVersion.Title) == dbVersion.CustomEntity.UrlSlug) return;

            var query = GetUniquenessQuery(dbVersion, definition);
            var isUnique = await _queryExecutor.ExecuteAsync(query);

            if (!isUnique)
            {
                var message = string.Format("Cannot publish because the {1} '{0}' is not unique (symbols and spaces are ignored in the uniqueness check)",
                        dbVersion.Title,
                        definition.GetTerms().GetOrDefault(CustomizableCustomEntityTermKeys.Title, "title").ToLower());

                throw new UniqueConstraintViolationException(message, "Title", dbVersion.Title);
            }
        }

        private IsCustomEntityPathUniqueQuery GetUniquenessQuery(CustomEntityVersion dbVersion, ICustomEntityDefinition definition)
        {
            var query = new IsCustomEntityPathUniqueQuery();
            query.CustomEntityDefinitionCode = definition.CustomEntityDefinitionCode;
            query.LocaleId = dbVersion.CustomEntity.LocaleId;
            query.UrlSlug = SlugFormatter.ToSlug(dbVersion.Title);
            query.CustomEntityId = dbVersion.CustomEntityId;

            return query;
        }

        #endregion
    }
}
