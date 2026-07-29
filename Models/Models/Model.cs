using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Rado.Models
{
    public class Model
    {
        public int ModelId { get; set; }
        public int CompanyId { get; set; }
        public string ModelName { get; set; }
        public string DisplayModelName { get; set; }
        public int GroupModelId { get; set; }
        public int YearFrom { get; set; }
        public int YearTo { get; set; }
        public int CountParts { get; set; }
        public int CountCars { get; set; }
        public int CountCarBus { get; set; }

        public ModelMin GetModelMin()
        {
            return new ModelMin()
            {
                modelId = ModelId,
                companyId = CompanyId,
                modelName = ModelName,
                displayModelName = DisplayModelName,
                groupModelId = GroupModelId,
                countParts = CountParts,
                countCars = CountCars
            };
        }

    }

    public class ModelMin
    {
        public int modelId { get; set; }
        public int companyId { get; set; }
        public string modelName { get; set; }
        public string displayModelName { get; set; }
        public int groupModelId { get; set; }
        public int countParts { get; set; }
        public int countCars { get; set; }
    }
}
