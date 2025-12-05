using Microsoft.Data.SqlClient;
using Rado.Enums;
using Rado.Models.Authentication;
using System.Text.Json.Serialization;
using System.Threading;
using Models.Models;
using Models.Models.Utility;

namespace Rado.Models
{
    public class RimWithTyreView : RimWithTyre
    {
        public int numberImages { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public ImageData mainImageData { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string companyName { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string modelName { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public TraderDetails traderDetails { get; set; }

    }
}
