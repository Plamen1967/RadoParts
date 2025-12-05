using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace FetchData.Model
{
    internal class GroupModel
    {
        string label {  get; set; }
        [JsonPropertyName("@options")]
        public Model[] models {  get; set; }
    }
}
