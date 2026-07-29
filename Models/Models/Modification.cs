using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Rado.Models
{
    public class Modification
    {
        public int ModificationId { get; set; }
        public int ModelId { get; set; }
        public string ModificationName { get; set; }
        public string ModificationDisplayName { get; set; }
        public int YearFrom { get; set; }
        public int YearTo { get; set; }
        public int PowerHP { get; set; }
        public int Engine { get; set; }
        public int Doors { get; set; }
        public int Kupe { get; set; }
        public int CountParts { get; set; }
        public int CountCars { get; set; }
        public int CountCarBus { get; set; }

        

        public ModificationMin GetModificationMin()
        {
            return new ModificationMin()
            {
                ModificationId = ModificationId,
                ModelId = ModelId,
                ModificationName = ModificationName,
                ModificationDisplayName = ModificationDisplayName,
                YearFrom = YearFrom,
                YearTo = YearTo,
                CountParts = CountParts,
                CountCars = CountCarBus,

            };
        }
    }

    public class ModificationMin 
    {
        public int ModificationId { get; set; }
        public int ModelId { get; set; }
        public string ModificationName { get; set; }
        public string ModificationDisplayName { get; set; }
        public int YearFrom { get; set; }
        public int YearTo { get; set; }

        public int CountParts { get; set; }
        public int CountCars { get; set; }

    }
}
