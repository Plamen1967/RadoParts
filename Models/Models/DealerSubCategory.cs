using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Rado.Models
{
    public class DealerSubCategory
    {
        public int dealerSubCategoryId { get; set; }
        public int subCategoryId { get; set; }
        public string dealerSubCategoryName { get; set; }
        public int categoryId { get; set; }
    }
}
