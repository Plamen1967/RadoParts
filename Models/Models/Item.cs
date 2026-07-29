using System.Text.Json.Serialization;

namespace Rado.Models
{
    public class Item
    {
        public string? Description { get; set; }
        public long MainImageId { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? MainPicture { get; set; }
        public int UserId { get; set; }
        public int Approved { get; set; }
        public long CreatedTime { get; set; }
        public long ModifiedTime { get; set; }
        public int RegionId { get; set; }
    }
}
