﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Cofoundry.Domain.Data;
using Cofoundry.Domain.CQS;
using Microsoft.EntityFrameworkCore;
using Cofoundry.Core;

namespace Cofoundry.Domain
{
    public class GetUpdateCustomEntityDraftVersionCommandByIdQueryHandler 
        : IAsyncQueryHandler<GetByIdQuery<UpdateCustomEntityDraftVersionCommand>, UpdateCustomEntityDraftVersionCommand>
        , IIgnorePermissionCheckHandler
    {
        #region constructor

        private readonly CofoundryDbContext _dbContext;
        private readonly IDbUnstructuredDataSerializer _dbUnstructuredDataSerializer;
        private readonly IQueryExecutor _queryExecutor;
        private readonly IPermissionValidationService _permissionValidationService;

        public GetUpdateCustomEntityDraftVersionCommandByIdQueryHandler(
            CofoundryDbContext dbContext,
            IQueryExecutor queryExecutor,
            IDbUnstructuredDataSerializer dbUnstructuredDataSerializer,
            IPermissionValidationService permissionValidationService
            )
        {
            _dbContext = dbContext;
            _dbUnstructuredDataSerializer = dbUnstructuredDataSerializer;
            _queryExecutor = queryExecutor;
            _permissionValidationService = permissionValidationService;
        }

        #endregion

        #region execution

        public async Task<UpdateCustomEntityDraftVersionCommand> ExecuteAsync(GetByIdQuery<UpdateCustomEntityDraftVersionCommand> query, IExecutionContext executionContext)
        {
            var dbResult = await _dbContext
                .CustomEntityVersions
                .Include(v => v.CustomEntity)
                .AsNoTracking()
                .FilterByActive()
                .FilterByCustomEntityId(query.Id)
                .Where(v => v.WorkFlowStatusId == (int)WorkFlowStatus.Draft)
                .SingleOrDefaultAsync();

            if (dbResult == null) return null;
            await _permissionValidationService.EnforceCustomEntityPermissionAsync<CustomEntityReadPermission>(dbResult.CustomEntity.CustomEntityDefinitionCode);

            var command = new UpdateCustomEntityDraftVersionCommand()
            {
                CustomEntityDefinitionCode = dbResult.CustomEntity.CustomEntityDefinitionCode,
                CustomEntityId = dbResult.CustomEntityId,
                Title = dbResult.Title
            };

            var definition = await _queryExecutor.GetByIdAsync<CustomEntityDefinitionSummary>(command.CustomEntityDefinitionCode);
            EntityNotFoundException.ThrowIfNull(definition, command.CustomEntityDefinitionCode);
            command.Model = (ICustomEntityDataModel)_dbUnstructuredDataSerializer.Deserialize(dbResult.SerializedData, definition.DataModelType);

            return command;
        }

        #endregion
    }
}
