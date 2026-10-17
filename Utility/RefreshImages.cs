using Microsoft.Data.SqlClient;
using Models.Models;

namespace Utility
{
    public static class RefreshImages
    {
        static void RefreshPartImages(string connectionString)
        {
            SqlConnection sqlConnection = new SqlConnection(connectionString);
            string sql = "Select * from ImageData WHERE Deleted = 0";
            sqlConnection.Open();
            SqlCommand sqlCommand = new SqlCommand(sql, sqlConnection);
            SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();
            while (sqlDataReader.Read())
            {
                var imageData = Loader.LoadImageData(sqlDataReader);
                string imageSrc = ImageManager.GenerateImageSrc(imageData.ObjectId, imageData.ImageId);
                string imageMinSrc = ImageManager.GenerateMinImageSrc(imageData.ObjectId, imageData.ImageId);
                string imageWebPSrc = ImageManager.GenerateWebPImageSrc(imageData.ObjectId, imageData.ImageId);
                bool imageSrcExist = File.Exists(imageSrc);
                bool imageMinSrcExist = File.Exists(imageMinSrc);
                bool imageWebPSrcExist = File.Exists(imageWebPSrc);

                if (!imageSrcExist || !imageMinSrcExist)
                {
                    var imageBytes = (byte[])sqlDataReader["imageData"];
                    if (!imageSrcExist)
                        ImageManager.CreateImage(imageSrc, imageBytes, false);
                    if (!imageMinSrcExist)
                        ImageManager.CreateImage(imageMinSrc, imageBytes, true);

                }

                if (!imageWebPSrcExist)
                {
                    _ = ImageManager.StoreWebPImage(imageData.ObjectId, imageData.ImageId);
                }

                ImageManager.CheckImageExists(imageData.ObjectId, imageData.ImageId);
            }
            sqlConnection.Close();
        }
        static void RefreshBusinessCard(string connectionString)
        {
            SqlConnection sqlConnection = new SqlConnection(connectionString);
            string sql = "Select * from BusinessCard WHERE Deleted = 0";
            sqlConnection.Open();
            SqlCommand sqlCommand = new SqlCommand(sql, sqlConnection);
            SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();
            while (sqlDataReader.Read())
            {
                var imageDataClass = new ImageDataClass();
                var imageBytes = (byte[])sqlDataReader["image"];
                int userId = (int)sqlDataReader["userId"];
                // imageDataClassReturn.imageDataClass = "data:image/jpg;base64," + base64ImageRepresentation;

                string imageSrc = ImageManager.GenerateImageSrc(userId, imageDataClass.ImageId);
                string imageMinSrc = ImageManager.GenerateMinImageSrc(userId, imageDataClass.ImageId);
                string imageWebPSrc = ImageManager.GenerateWebPImageSrc(userId, imageDataClass.ImageId);
                bool imageSrcExist = File.Exists(imageSrc);
                bool imageMinSrcExist = File.Exists(imageMinSrc);
                bool imageWebPSrcExist = File.Exists(imageWebPSrc);

                if (!imageSrcExist || !imageMinSrcExist)
                {
                    if (!imageSrcExist)
                        ImageManager.CreateImage(imageSrc, imageBytes, false);
                    if (!imageMinSrcExist)
                        ImageManager.CreateImage(imageMinSrc, imageBytes, true);

                }
                if (!imageWebPSrcExist)
                {
                    _ = ImageManager.StoreWebPImage(userId, imageDataClass.ImageId);
                }

                ImageManager.CheckImageExists(userId, imageDataClass.ImageId);
            }
            sqlConnection.Close();
        }
        public static void Refresh(string connectionString)
        {
            RefreshBusinessCard(connectionString);
            RefreshPartImages(connectionString);
        }

    }

}
