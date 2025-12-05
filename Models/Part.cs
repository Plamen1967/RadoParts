using Microsoft.Data.SqlClient;
using Rado.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Rado
{
    public class Part : Item
    {
        [Required]
        public long partId { get; set; }
        public long? carId { get; set; }
        public int? categoryId { get; set; }
        public int? subCategoryId { get; set; }
        [Required] 
        public int dealerSubCategoryId { get; set; }
        [Required]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string dealerSubCategoryName { get; set; }
        public int? leftRightPosition { get; set; }
        public int? frontBackPosition { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? partNumber { get; set; }
        public int? modelId { get; set; }
        public int? engineType { get; set; }
        public string? engineModel { get; set; }
        [Required]
        public int? year { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public int? powerkWh { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public int? powerBHP { get; set; }
        [Required]
        public int modificationId { get; set; }
        public string? modification { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public int? millage { get; set; }
        public int? gearboxType { get; set; }
        public int? bus { get; set; }
        [Required]
        public decimal price { get; set; }
        public Part()
        { }
    }
}
