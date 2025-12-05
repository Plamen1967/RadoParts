using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Rado.Models
{
    public class FilterNumberPartsPerCategory
    {
        public long companyId { get; set; }
        public long modelId { get; set; }
        public string? modelsId { get; set; }
        public int modificationId { get; set; }
        public string? modificationsId { get; set; }
        public bool hasImages {  get; set; }
        public int userId { get; set; }
        public bool adminRun { get; set; }
        public int bus { get; set; }
    }
}
