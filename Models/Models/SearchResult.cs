using Models.Enums;
using Models.Models;
using Rado.Models.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Rado.Models
{
    public class SearchResult
    {
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public UserCount userCount { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public UserView userView { get; set; }
        public DisplayPartView[] data { get; set; }
        public long duration { get; set; }
        public int size { get; set; }
        public long currentItem { get; set; }
        public int clientId { get; set; }
        public Filter filter { get; set; }
    }
}
