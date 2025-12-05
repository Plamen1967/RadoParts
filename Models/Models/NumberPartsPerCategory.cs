using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Rado.Models
{
    public class NumberPartsPerCategory
    {
        public int categoryId { get; set; }
        public string categoryName { get; set; }
        public int numberParts { get; set; }

        public List<SubCategory> subCategories { get; set; }
    }
}
