using Microsoft.Data.SqlClient;
using Models.Models;
using Utility;

namespace Rado.Utility
{
    public class RefreshImages
    {
        static void RefreshPartImages(string connectionString)
        {
            using (SqlConnection sqlConnection = new SqlConnection(connectionString))
            {
                string sql = "Select * from ImageData WHERE Deleted = 0";
                sqlConnection.Open();
                using (SqlCommand sqlCommand = new SqlCommand(sql, sqlConnection))
                {
                    using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                    {
                        while (sqlDataReader.Read())
                        {
                            var imageData = Loader.LoadImageData(sqlDataReader);
                            string imageSrc = ImageManager.GenerateImageSrc(imageData.objectId, imageData.imageId);
                            string imageMinSrc = ImageManager.GenerateMinImageSrc(imageData.objectId, imageData.imageId);
                            byte[] imageBytes;
                            bool imageSrcExist = File.Exists(imageSrc);
                            bool imageMinSrcExist = File.Exists(imageMinSrc);

                            if (!imageSrcExist || !imageMinSrcExist)
                            {
                                imageBytes = (byte[])sqlDataReader["imageData"];
                                if (!imageSrcExist)
                                    ImageManager.CreateImage(imageSrc, imageBytes, false);
                                if (!imageMinSrcExist)
                                    ImageManager.CreateImage(imageMinSrc, imageBytes, true);

                            }

                            ImageManager.CheckImageExists(imageData.objectId, imageData.imageId);
                        }

                    }
                    sqlConnection.Close();

                }
            }
        }
        static void RefreshBusinessCard(string connectionString)
        {
            using (SqlConnection sqlConnection = new SqlConnection(connectionString))
            {
                string sql = "Select * from BusinessCard WHERE Deleted = 0";
                sqlConnection.Open();
                using (SqlCommand sqlCommand = new SqlCommand(sql, sqlConnection))
                {
                    using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
                    {
                        ImageData imageData;
                        while (sqlDataReader.Read())
                        {
                            imageData = new ImageData();
                            var imageBytes = (byte[])sqlDataReader["image"];
                            int userId = (int)sqlDataReader["userId"];
                            string base64ImageRepresentation = Convert.ToBase64String(imageBytes);
                            // imageDataReturn.imageData = "data:image/jpg;base64," + base64ImageRepresentation;

                            string imageSrc = ImageManager.GenerateImageSrc(userId, imageData.imageId);
                            string imageMinSrc = ImageManager.GenerateMinImageSrc(userId, imageData.imageId);
                            bool imageSrcExist = File.Exists(imageSrc);
                            bool imageMinSrcExist = File.Exists(imageMinSrc);

                            if (!imageSrcExist || !imageMinSrcExist)
                            {
                                if (!imageSrcExist)
                                    ImageManager.CreateImage(imageSrc, imageBytes, false);
                                if (!imageMinSrcExist)
                                    ImageManager.CreateImage(imageMinSrc, imageBytes, true);

                            }

                            ImageManager.CheckImageExists(userId, imageData.imageId);
                        }

                    }
                    sqlConnection.Close();

                }
            }
        }
        public static void Refresh(string connectionString)
        {
            RefreshBusinessCard(connectionString);
            RefreshPartImages(connectionString);
        }

    }

}
