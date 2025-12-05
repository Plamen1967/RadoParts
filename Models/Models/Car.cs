using Rado;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.IO;
using System.Text.Json.Serialization;

namespace Models.Models
{
    public class Car : Item
    {
        protected List<ImageData>? images_ = new List<ImageData>();
        [Required]
        public long carId { get; set; }
        public int? modelId { get; set; }
        [Required]
        public int modificationId { get; set; }
        public int year { get; set; }
        public string? vin { get; set; }
        [Required]
        public string regNumber { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int powerkWh { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int powerBHP { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int engineType { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string? engineModel { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int millage { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int gearboxType { get; set; }
        public int bus { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Part[]? parts { get; set; }
    }
}
