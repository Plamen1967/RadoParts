using Models.Models.Utility;
using Rado.Models;
using System.Text.Json.Serialization;

namespace Models.Models
{
    public class RimWithTyreView : RimWithTyre
    {
        public int NumberImages { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public ImageDataClass MainImageData { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string CompanyName { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string ModelName { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public TraderDetails TraderDetails { get; set; }

    }
}
