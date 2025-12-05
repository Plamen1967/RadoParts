using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Rado.Models
{
    public class CarNameId
    {
        public long carId { get; set; }
        public int companyId { get; set; }
        public int modelId { get; set; }
        public string regNumber { get; set; }
        public int engineType { get; set; }
        public string engineModel { get; set; }
    }
}
