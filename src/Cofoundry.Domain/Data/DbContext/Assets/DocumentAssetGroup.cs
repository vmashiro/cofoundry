using System;
using System.Collections.Generic;

namespace Cofoundry.Domain.Data
{
    public partial class DocumentAssetGroup : ICreateAuditable
    {
        public DocumentAssetGroup()
        {
            DocumentAssetGroupItems = new List<DocumentAssetGroupItem>();
            ChildDocumentAssetGroups = new List<DocumentAssetGroup>();
        }

        public int DocumentAssetGroupId { get; set; }
        public string GroupName { get; set; }
        public Nullable<int> ParentDocumentAssetGroupId { get; set; }
        public bool IsDeleted { get; set; }
        public virtual ICollection<DocumentAssetGroupItem> DocumentAssetGroupItems { get; set; }
        public virtual ICollection<DocumentAssetGroup> ChildDocumentAssetGroups { get; set; }
        public virtual DocumentAssetGroup ParentDocumentAssetGroup { get; set; }

        #region ICreateAuditable

        public System.DateTime CreateDate { get; set; }
        public int CreatorId { get; set; }
        public virtual User Creator { get; set; }

        #endregion
    }
}
