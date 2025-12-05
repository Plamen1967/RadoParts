using Microsoft.Data.SqlClient;
using Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Rado.Models
{
    public class View
    {
        public int companyId { get; set; }
        public string companyName { get; set; }
        public int modelId { get; set; }
        public string modelName { get; set; }
        public int modificationId { get; set; }
        public string modificationName { get; set; }
        public long carId { get; set; }
        public int year { get; set; }
        public string vin { get; set; }
        public string regNumber { get; set; }
        public string description { get; set; }
        public decimal price { get; set; }
        public int powerkWh { get; set; }
        public int powerBHP { get; set; }
        public int engineType { get; set; }
        public string engineModel { get; set; }
        public int userId { get; set; }
        public int millage { get; set; }
        public int regionId { get; set; }
        public int gearboxType { get; set; }
        public string categoryName { get; set; }
        public bool isCar { get; set; }
        public long createdTime { get; set; }
        public string sellerName { get; set; }
        public string sellerPhone { get; set; }
        public string sellerPhone2 { get; set; }
        public string sellerWhatsUp { get; set; }
        public string sellerVibew { get; set; }
        public string sellerWebPage { get; set; }
        public long partId { get; set; }
        public int categoryId { get; set; }
        public int subCategoryId { get; set; }
        public int leftRightPosition { get; set; }
        public int frontBackPosition { get; set; }
        public string partNumber { get; set; }
        public long modifiedTime { get; set; }

        List<ImageData> images_ = new List<ImageData>();
        public ImageData[] images { get { return images_.ToArray(); } }
    }
}
