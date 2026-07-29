using Microsoft.Data.SqlClient;
using System.Drawing;
using System.Drawing.Imaging;
using System.Text.Json.Serialization;

namespace Models.Models
{
    public class ImageDataClass
    {
        public int ImageId { get; set; }
        [JsonIgnore]
        public int UserId { get; set; }
        [JsonIgnore]
        public long ObjectId { get; set; }
        [JsonIgnore]
        public string ImageData { get; set; }
        [JsonIgnore]
        public string? ImageFile { get; set; }
        [JsonIgnore]
        public int ImageType { get; set; }
        [JsonIgnore]
        public int OriginalImageId { get; set; }
        [JsonIgnore]
        public int Deleted { get; set; }
        public string ImageSrc { get; set; }
        public string ImageMinSrc { get; set; }
        [JsonIgnore]
        public DateTime DeleteDateTime { get; set; }

        //public void InitImageData(SqlDataReader sqlDataReader)
        //{
        //    byte[] imageBytes = (byte[])sqlDataReader["imageData"];

        //    string base64ImageRepresentation = Convert.ToBase64String(imageBytes);
        //    Image img = Image.FromStream(new MemoryStream(imageBytes));
        //    Bitmap minImage = ImageManager.ResizeImage(img, new Size(800, 600));

        //    using (MemoryStream m = new MemoryStream())
        //    {
        //        minImage.Save(m, ImageFormat.Jpeg);
        //        imageBytes = m.ToArray();
        //    }

        //    base64ImageRepresentation = Convert.ToBase64String(imageBytes);
        //    imageData = "data:image/jpg;base64," + base64ImageRepresentation;
        //}



    }


}