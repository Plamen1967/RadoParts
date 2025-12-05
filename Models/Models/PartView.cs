using Microsoft.Data.SqlClient;
using Models.Models;
using Rado;
using Rado.Models.Authentication;
using System.Diagnostics;
using System.Text.Json.Serialization;

namespace Rado.Models
{
    public class PartView : Part
    {
        public string companyName { get; set; }
        public int companyId { get; set; }
        public string modelName { get; set; }
        public string modificationName { get; set; }
        public string categoryName { get; set; }
        public bool isCar { get; set; }
        public string regNumber { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string vin { get; set; }
        public int numberImages { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string yearName { get; set; }
        public ImageData mainImageData { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public TraderDetails traderDetails { get; set;}

        public PartView()
        {
            leftRightPosition = frontBackPosition = 0;
        }

    }
}
