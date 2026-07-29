using Models.Models;
using System.Text.Json.Serialization;

namespace Rado.Models
{
    public class PartView : Part
    {
        public string CompanyName { get; set; }
        public int CompanyId { get; set; }
        public string ModelName { get; set; }
        public string ModificationName { get; set; }
        public string CategoryName { get; set; }
        public bool IsCar { get; set; }
        public string RegNumber { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string Vin { get; set; }
        public int NumberImages { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string YearName { get; set; }
        public ImageDataClass MainImageDataClass { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public TraderDetails TraderDetails { get; set;}

        public PartView()
        {
            LeftRightPosition = FrontBackPosition = 0;
        }

    }
}
