using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Rado.Models
{
    public class Modification
    {
        public int modificationId { get; set; }
        public int modelId { get; set; }
        public string modificationName { get; set; }
        public string modificationDisplayName { get; set; }
        public int yearFrom { get; set; }
        public int yearTo { get; set; }
        public int powerHP { get; set; }
        public int engine { get; set; }
        public int doors { get; set; }
        public int kupe { get; set; }
        public int countParts { get; set; }
        public int countCars { get; set; }
        public int countCarBus { get; set; }

        

        public ModificationMin GetModificationMin()
        {
            return new ModificationMin()
            {
                modificationId = modificationId,
                modelId = modelId,
                modificationName = modificationName,
                modificationDisplayName = modificationDisplayName,
                yearFrom = yearFrom,
                yearTo = yearTo,
                countParts = countParts,
                countCars = countCarBus,

            };
        }
    }

    public class ModificationMin 
    {
        public int modificationId { get; set; }
        public int modelId { get; set; }
        public string modificationName { get; set; }
        public string modificationDisplayName { get; set; }
        public int yearFrom { get; set; }
        public int yearTo { get; set; }

        public int countParts { get; set; }
        public int countCars { get; set; }

    }
}
