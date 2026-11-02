using Rado.Enums;

namespace Models.Models
{
    public class DeleteImage
    {
        public long imageId { get; set; }
        public long objectId { get; set; }
        public long mainImageId { get; set; }
    }
}
