using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Rado.Models
{
    public class SubCategory
    {
        public int subCategoryId { get; set; }
        public int categoryId { get; set; }
        public string subCategoryName { get; set; }
        public int count { get; set; }
    }
}
