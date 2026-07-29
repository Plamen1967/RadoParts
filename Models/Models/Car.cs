using Rado;
using Rado.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models.Models
{
    public class Car : Item
    {
        protected List<ImageDataClass>? images_ = new List<ImageDataClass>();
        [Required]
        public long CarId { get; set; }
        public int? ModelId { get; set; }
        public int? ModificationId { get; set; }
        public int Year { get; set; }
        public string? Vin { get; set; }
        [Required]
        public string RegNumber { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int PowerkWh { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int PowerBHP { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int EngineType { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string? EngineModel { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int Millage { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int GearboxType { get; set; }
        public int Bus { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Part[]? Parts { get; set; }
    }
}
