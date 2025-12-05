using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Rado.Models
{
    public class Model
    {
        public int modelId { get; set; }
        public int companyId { get; set; }
        public string modelName { get; set; }
        public string displayModelName { get; set; }
        public int groupModelId { get; set; }
        public int yearFrom { get; set; }
        public int yearTo { get; set; }
        public int countParts { get; set; }
        public int countCars { get; set; }
        public int countCarBus { get; set; }

        public ModelMin GetModelMin()
        {
            return new ModelMin()
            {
                modelId = modelId,
                companyId = companyId,
                modelName = modelName,
                displayModelName = displayModelName,
                groupModelId = groupModelId,
                countParts = countParts,
                countCars = countCars
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
