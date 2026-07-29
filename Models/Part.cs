using Microsoft.Data.SqlClient;
using Rado.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Rado
{
    public class Part : Item
    {
        public Part() { }
        [Required]
        public long PartId { get; set; }
        public long? CarId { get; set; }
        public int? CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        [Required] 
        public int DealerSubCategoryId { get; set; }
        [Required]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string DealerSubCategoryName { get; set; }
        public int? LeftRightPosition { get; set; }
        public int? FrontBackPosition { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? PartNumber { get; set; }
        public int? ModelId { get; set; }
        public int? EngineType { get; set; }
        public string? EngineModel { get; set; }
        [Required]
        public int? Year { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public int? PowerkWh { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public int? PowerBHP { get; set; }
        [Required]
        public int ModificationId { get; set; }
        public string? Modification { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public int? Millage { get; set; }
        public int? GearboxType { get; set; }
        public int? Bus { get; set; }
        [Required]
        public decimal Price { get; set; }
    }
}
