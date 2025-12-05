using Microsoft.Data.SqlClient;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Rado.Models
{
    public class Item
    {
        public string? description { get; set; }
        public long mainImageId { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? mainPicture { get; set; }
        public int userId { get; set; }
        public int approved { get; set; }
        public long createdTime { get; set; }
        public long modifiedTime { get; set; }
        public int regionId { get; set; }
    }
}
