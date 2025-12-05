using Microsoft.Data.SqlClient;
using System.Drawing;
using System.Drawing.Imaging;
using System.Text.Json.Serialization;

namespace Models.Models
{
    public class ImageData
    {
        public int imageId { get; set; }
        [JsonIgnore]
        public int userId { get; set; }
        [JsonIgnore]
        public long objectId { get; set; }
        [JsonIgnore]
        public string imageData { get; set; }
        [JsonIgnore]
        public string imageFile { get; set; }
        [JsonIgnore]
        public int imageType { get; set; }
        [JsonIgnore]
        public int originalImageId { get; set; }
        [JsonIgnore]
        public int deleted { get; set; }
        public string imageSrc { get; set; }
        public string imageMinSrc { get; set; }
        [JsonIgnore]
        public DateTime deleteDateTime { get; set; }

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
