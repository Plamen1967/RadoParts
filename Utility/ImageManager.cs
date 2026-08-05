using Libwebp.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Primitives;
using Models.Models;
using Rado.Enums;
using Rado.Exceptions;
using Rado.Models;
using Settings;
using System.Data;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Net.Http.Headers;
using System.Text;
using Image = System.Drawing.Image;

namespace Utility
{
    public class ImageManager
    {
        #region properties
        private const int OrientationKey = 0x0112;
        private const int NotSpecified = 0;
        private const int NormalOrientation = 1;
        private const int MirrorHorizontal = 2;
        private const int UpsideDown = 3;
        private const int MirrorVertical = 4;
        private const int MirrorHorizontalAndRotateRight = 5;
        private const int RotateLeft = 6;
        private const int MirorHorizontalAndRotateLeft = 7;
        private const int RotateRight = 8;
        static Dictionary<long, string> catchaCache = new Dictionary<long, string>();

        private static string devPath 
        { 
            get
            {
                if (ProgramSettings.DevelopmentMode) 
                    return "part365";

                return "";
            }
        }

        private static string rootPath
        {
            get
            {
                return ProgramSettings.WebRootFolder;
            }
        }

        private static string photoPath 
        { 
            get
            {
                return Path.Combine(rootPath, ProgramSettings.ImageFolder);
            } 
        }
        #endregion

        #region get paths
        public static string GenerateImageHRef(long objectId, long imageId, bool minimized)
        {
            string minimizedDir = minimized ? "min" : "";
            string assetDir = ProgramSettings.DevelopmentMode ? "" : "";
            if (ProgramSettings.PictureHref != null)
            {
                string imageSrc = Path.Combine(ProgramSettings.PictureHref, assetDir, ProgramSettings.ImageFolder, objectId.ToString(), minimizedDir);
                imageSrc = imageSrc + "/" + imageId + ".jpeg";
                imageSrc = imageSrc.Replace("\\", "/");

                return imageSrc;
            }

            return "";
        }
        public static string GenerateMinImageSrc(long objectId, long imageId)
        {
            string path = GetPhotosPath(objectId);

            return path + "min/" + imageId + ".jpeg";
        }
        public static string GenerateImageSrc(long objectId, long imageId)
        {
            string path = GetPhotosPath(objectId);

            return path + imageId + ".jpeg";
        }
        public static string GenerateWebPImageSrc(long objectId, long imageId)
        {
            string path = GetPhotosPath(objectId);
            string webpPath = path + "webp";
            if (!Directory.Exists(webpPath))
                Directory.CreateDirectory(webpPath);

            return webpPath + "/" + imageId + ".webp";
        }
        public static string GetPhotosPath(long objectId)
        {
            string path = photoPath;
            return Path.Combine(photoPath, objectId.ToString()) + "/";
        }
        private static string GetPhotosPath(string objectId)
        {
            long objectId_;
            Int64.TryParse(objectId, out objectId_);

            return GetPhotosPath(objectId_);
        }
        private static string generateMinImageFileName(string imageFileName)
        {
            imageFileName = imageFileName.Replace("/", "\\");

            string folder = imageFileName.Substring(0, imageFileName.LastIndexOf('\\')) + "\\min\\";
            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            return imageFileName.Insert(imageFileName.LastIndexOf('\\') + 1, "min\\");
        }
        #endregion

        public static async Task StoreWebPImage(long itemId, long originalImageId)
        {
            string imageSrc = GenerateImageSrc(itemId, originalImageId);
            string WebpFilePath = GenerateWebPImageSrc(itemId, originalImageId);
            await using var file = new FileStream(imageSrc, FileMode.Open);
            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);
            //setup configuration for the encoder
            var config = new WebpConfigurationBuilder().Output("output.webp").Build();
            // create an encoder and pass in the configuration
            var encoder = new WebpEncoder(config);
            // start encoding by passing your memorystream and filename
            var output = await encoder.EncodeAsync(ms, Path.GetFileName(file.Name));

            await using var outFile = new FileStream(WebpFilePath, FileMode.Create);
            await output.CopyToAsync(outFile);

            #region Image Encoder
            /* your converted file is returned as FileStream, do what you want download,

               copy to disk, write to db or save on cloud storage,*/


            //var imageBytes = await File.ReadAllBytesAsync(imageSrc);

            //using var inStream = new MemoryStream(imageBytes);

            //WebPConfiguration config = new WebpConfigurationBuilder().Output(WebpFilePath).Build();
            //// create an encoder and pass in the configuration
            //if (config != null)
            //{
            //    var encoder = new WebpEncoder();
            //    // start encoding by passing your memorystream and filename
            //    var output = await encoder.EncodeAsync(inStream, Path.GetFileName(WebpFilePath));
            //}

            //using var myImage = Image.FromStream(inStream);

            //using var outStream = new MemoryStream();

            //await myImage.SaveAsync(outStream, new WebpEncoder());

            //return new FileContentResult(outStream.ToArray(), "image/webp");
            //var webPFileStream = new FileStream(WebpFilePath, FileMode.Create);
            //ImageFactory imageFactory = new ImageFactory(preserveExifData: false);
            //_ = imageFactory.Load(File.OpenRead(imageSrc))
            //    .Format(new WebPFormat())
            //    .Quality(100)
            //    .Save(webPFileStream);
            #endregion
        }

        private static async Task<ImageDataClass?> SaveImageAsync(string fullPath, int userId, string itemId)
        {
            return await SaveImageAsync(fullPath, userId, Int64.Parse(itemId));
        }

        private static async Task<ImageDataClass?> SaveImageAsync(string fullPath, int userId, long itemId)
        {

            byte[] imageArray = await System.IO.File.ReadAllBytesAsync(fullPath);
            int originalImageId = await StoreInDb(userId, itemId.ToString(), imageArray, fullPath, 0);
            string imageSrc = GenerateImageSrc(itemId, originalImageId);
            string imageMinSrc = GenerateMinImageSrc(itemId, originalImageId);
            CreateImage(imageSrc, imageArray, true);
            CreateImage(imageMinSrc, imageArray, true);
            await StoreWebPImage(itemId, originalImageId);

            try
            {
                return GetImageById(originalImageId);
            }
            catch (Exception ex)
            {
              LoggerUtil.LogException(ex.Message);
            }

            return null;
        }
        public static void CreateImage(string fileName, byte[] imageBytes, bool minimized)
        {
            if (File.Exists(fileName)) 
                return;

            string directoryName = System.IO.Path.GetDirectoryName(fileName);

            if (!Directory.Exists(directoryName))
                Directory.CreateDirectory(directoryName);

            if (minimized)
            {
                string base64ImageRepresentation = Convert.ToBase64String(imageBytes);
                var imageMemoryStream = new MemoryStream(Convert.FromBase64String(base64ImageRepresentation));
                var img = Image.FromStream(imageMemoryStream);
                LoggerUtil.LogFunctionInfo($"CreateImage {fileName}");
                var inputStream = new MemoryStream();
                var oututStream = new MemoryStream();
                img.Save(inputStream, ImageFormat.Jpeg);
                TargetSize targetSize = new TargetSize(200, 200);

                try
                {
                    resizeImage3(targetSize, 2, inputStream, oututStream);
                    MemoryStream mem = new MemoryStream();
                    mem.CopyTo(oututStream);
                    var yourImage = Image.FromStream(oututStream);

                    yourImage.Save(fileName, ImageFormat.Jpeg);
                    yourImage.Dispose();
                }
                catch (Exception ex)
                {
                    LoggerUtil.LogException(ex.Message);
                    File.WriteAllBytes(fileName, imageBytes);
                }
            }
            else 
                File.WriteAllBytes(fileName, imageBytes);
        }
        private static async Task<int> StoreInDb(int userId, string objectId, byte[] imageData, string fullPath, int originalImageId)
        {
            string storeProcedureName = "ImageDataIns";
            try
            {
                if (imageData.Length > ProgramSettings.MaxSize)
                {
                    TargetSize targetSize = new TargetSize(400, 400);
                    MemoryStream inputStream = new MemoryStream(imageData);
                    MemoryStream outputStream = new MemoryStream();
                    resizeImage3(targetSize, 2, inputStream, outputStream);
                    imageData = outputStream.ToArray();
                }
                ImageType imageType = ImageType.Normanl;

                await using SqlConnection sqlConnection = new SqlConnection(ProgramSettings.ConnectionString);
                await using SqlCommand sqlCommand = new SqlCommand(storeProcedureName, sqlConnection);

                if (!Int64.TryParse(objectId, out var objectIdAsLong))
                    throw new AppException($"Снимката неуспешно е качена");

                sqlCommand.CommandType = CommandType.StoredProcedure;

                sqlCommand.Parameters.Add("@userId", SqlDbType.Int).Value = userId;
                sqlCommand.Parameters.Add("@objectId", SqlDbType.BigInt).Value = objectIdAsLong;
                sqlCommand.Parameters.Add("@imageFile", SqlDbType.VarChar).Value = fullPath;
                sqlCommand.Parameters.Add("@originalImageId", SqlDbType.Int).Value = originalImageId;
                sqlCommand.Parameters.Add("@imageData", SqlDbType.Image).Value = imageData;
                sqlCommand.Parameters.Add("@imageType", SqlDbType.Int).Value = imageType;
                sqlCommand.Parameters.Add("@imageId", SqlDbType.Int).Direction = ParameterDirection.Output;

                await sqlConnection.OpenAsync();
                int columns = await sqlCommand.ExecuteNonQueryAsync();
                int imageId = (int)sqlCommand.Parameters["@imageId"].Value;
                await sqlConnection.CloseAsync();

                if (columns != 1)
                {
                    throw new AppException($"Снимката неуспешно е качена");
                }
                return imageId;
            }
            catch (Exception exception)
            {
                LoggerUtil.LogFunctionInfo("StoreInDB");
                LoggerUtil.LogException(exception.Message);
                throw new AppException($"Снимката неуспешно е качена");
            }

        }
        public static async Task<ImageDataClass[]> GetImagesAsync(long objectId)
        {
            List<ImageDataClass> imageDataList = new List<ImageDataClass>();
            string storeProcedureName = $"SELECT  imageId, userId, imageFile, imageType " +
                                        $"FROM ImageData WHERE objectId = {objectId} and " +
                                        $"imageType <> 2 AND deleted = 0";

            try
            {
                SqlConnection sqlConnection = new SqlConnection(ProgramSettings.ConnectionString);

                await sqlConnection.OpenAsync();

                SqlDataAdapter sda = new SqlDataAdapter(storeProcedureName, sqlConnection);
                DataTable dt = new DataTable();
                sda.Fill(dt);

                foreach (DataRow row in dt.Rows)
                {
                    ImageDataClass imageDataClass = new ImageDataClass
                    {
                        ObjectId = objectId,
                        ImageId = (int)row["imageId"],
                        UserId = (int)row["userId"],
                        ImageFile = row["imageFile"] as string,
                        ImageType = (int)row["imageType"]
                    };
                    imageDataClass.ImageMinSrc = GenerateImageHRef(imageDataClass.ObjectId, imageDataClass.ImageId, true);
                    imageDataClass.ImageSrc = GenerateImageHRef(imageDataClass.ObjectId, imageDataClass.ImageId, false);
                    imageDataList.Add(imageDataClass);
                }
                
                await sqlConnection.CloseAsync();
                return imageDataList.ToArray();
            }
            catch (Exception exception)
            {
                LoggerUtil.LogFunctionInfo("GetImages");
                LoggerUtil.LogException(exception.Message);
                throw new AppException($"Снимкатите не могат да се заредят");
            }
        }
        private static async Task<ImageDataClass> GetMainImage(long objectId)
        {
            ImageDataClass imageDataClassItem = null;
            string storeProcedureName = "ImageDataMainImage";

            try
            {
                await using SqlConnection sqlConnection = new SqlConnection(ProgramSettings.ConnectionString);
                await using SqlCommand sqlCommand = new SqlCommand(storeProcedureName, sqlConnection);
                sqlCommand.CommandType = CommandType.StoredProcedure;

                sqlCommand.Parameters.Add("@objectId", SqlDbType.BigInt).Value = objectId;

                await sqlConnection.OpenAsync();

                await using SqlDataReader sqlDataReader = await sqlCommand.ExecuteReaderAsync();
                if (await sqlDataReader.ReadAsync())
                {
                    imageDataClassItem = Loader.LoadImageData(sqlDataReader);
                }
                if (imageDataClassItem == null)
                {
                    ImageDataClass[] images = await GetMinImagesAsync(objectId);
                    if (images.Length > 0)
                        imageDataClassItem = images[0];
                }
                await sqlConnection.CloseAsync();

                return imageDataClassItem;
            }
            catch (Exception exception)
            {
                LoggerUtil.LogFunctionInfo("getMainImage");
                LoggerUtil.LogException(exception.Message);
                throw new AppException($"Снимкатите не могат да се заредят");
            }

        }
        #region Get First Image for part / car if it is not stored
        public static ImageDataClass GetMinImageById(long imageId)
        {
            ImageDataClass mainImage = null;
            try
            {
                mainImage = GetImageById(imageId);
            }
            catch (Exception exp)
            {
                LoggerUtil.LogException(string.Format("{0} {1}", System.Reflection.MethodBase.GetCurrentMethod().Name, imageId));
                LoggerUtil.LogException(exp.Message);
            }

            return mainImage;
        }
        public static async Task<ImageDataClass> GetMainImageAsync(long id)
        {
            ImageDataClass mainImage = null;
            try
            {
                mainImage = await GetMainImage(id);
            }
            catch (Exception exp)
            {
                LoggerUtil.LogException(string.Format("{0} {1}", System.Reflection.MethodBase.GetCurrentMethod().Name, id));
                LoggerUtil.LogException(exp.Message);
            }

            return mainImage;

        }
        #endregion
        private static ImageDataClass GetImageById(long imageId)
        {
            ImageDataClass imageDataClass = null;
            string storeProcedureName = "ImageDataById";

            try
            {
                SqlConnection sqlConnection = new SqlConnection(ProgramSettings.ConnectionString);
                SqlCommand sqlCommand = new SqlCommand(storeProcedureName, sqlConnection);
                sqlCommand.CommandType = CommandType.StoredProcedure;

                sqlCommand.Parameters.Add("@imageId", SqlDbType.BigInt).Value = imageId;

                sqlConnection.Open();

                SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();
                if (sqlDataReader.Read())
                {
                    LoggerUtil.LogFunctionInfo($"GetImageById {imageId}");
                    imageDataClass = Loader.LoadImageData(sqlDataReader);
                }
                sqlConnection.Close();
                return imageDataClass;
            }
            catch (Exception exception)
            {
                LoggerUtil.LogFunctionInfo("GetImageById");
                LoggerUtil.LogException(exception.Message);
                throw new AppException($"Снимкатa не могат да се заредят");
            }
            
        }
        #region delete image
        public static async Task<bool> DeleteImageAsync(int userId, int imageId)
        {
            string storeProcedureName = "ImageDataDel";
            try
            {
                await using SqlConnection sqlConnection = new SqlConnection(ProgramSettings.ConnectionString);
                await using SqlCommand sqlCommand = new SqlCommand(storeProcedureName, sqlConnection);

                sqlCommand.CommandType = CommandType.StoredProcedure;

                sqlCommand.Parameters.Add("@userId", SqlDbType.Int).Value = userId;
                sqlCommand.Parameters.Add("@imageId", SqlDbType.Int).Value = imageId;
                var objectIdParam = sqlCommand.Parameters.Add("@objectId", SqlDbType.BigInt);
                objectIdParam.Direction = ParameterDirection.Output;

                await sqlConnection.OpenAsync();

                var result = await sqlCommand.ExecuteNonQueryAsync();
                var objectId = (long)objectIdParam.Value;

                await sqlConnection.CloseAsync();

                DeleteFromDiscSpace(objectId, imageId);

                if (result != 1)
                {
                    throw new AppException($"Снимката не може да бъде изтрита");
                }
            }
            catch (Exception exception)
            {
                LoggerUtil.LogFunctionInfo("DeleteImage");
                LoggerUtil.LogException(exception.Message);
                throw new AppException($"Снимката не може да бъде изтрита");
            }

            return true;
        }
        static void DeleteFromDiscSpace(long objectId, int imageId)
        {
            string imageSrc = GenerateImageSrc(objectId, imageId);
            string imageMinSrc = GenerateMinImageSrc(objectId, imageId);
            string imageWebPSrc = GenerateWebPImageSrc(objectId, imageId);

            try
            {
                File.Delete(imageSrc);
                File.Delete(imageMinSrc);
                File.Delete(imageWebPSrc);

                CheckImageCount(objectId);
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);
            }
        }
        #endregion

        #region helper functions
        static void CheckImageCount(long objectId)
        {
            int imageCount = 0, minImageCount = 0;
            GegImageCount(objectId, ref imageCount, ref minImageCount);
            var resultImageCount = GetImageCount(objectId);
            resultImageCount.Wait();
            if (resultImageCount.Result != imageCount)
            {
                LoggerUtil.LogFunctionInfo($"CheckImageCount {objectId} {imageCount} {resultImageCount.Result}");
            }
        }

        public static async Task<int> GetImageCount(long objectId)
        {
            string storeProcedureName = "ImageDataCount";

            try
            {
                SqlConnection sqlConnection = new SqlConnection(ProgramSettings.ConnectionString);
                SqlCommand sqlCommand = new SqlCommand(storeProcedureName, sqlConnection);
                sqlCommand.CommandType = CommandType.StoredProcedure;

                sqlCommand.Parameters.Add("@objectId", SqlDbType.BigInt).Value = objectId;

                await sqlConnection.OpenAsync();

                int imageCount = 0;

                SqlDataReader sqlDataReader = await sqlCommand.ExecuteReaderAsync();
                if (await sqlDataReader.ReadAsync())
                {
                    imageCount = Convert.ToInt32(sqlDataReader["imageCount"]);
                }

                await sqlConnection.CloseAsync();

                return imageCount;
            }
            catch (Exception exception)
            {
                LoggerUtil.LogFunctionInfo("GetNumberImages");
                LoggerUtil.LogException(exception.Message);
                throw new AppException($"Броят на снимките не може да бъде върнат");
            }

        }
        private static void GegImageCount(long objectId, ref int imageCount, ref int minImageCount)
        {
            string path = GetPhotosPath(objectId);
            if (Directory.Exists(path))
            {
                imageCount = Directory.GetFiles(path, "*.*").Length;
                minImageCount = Directory.GetFiles(Path.Combine(path, "min"), "*.*").Length;
            }
        }
        public static void CheckImageExists(long objectId, long imageId)
        {
            string imageSrc = GenerateImageSrc(objectId, imageId);
            string imageMinSrc = GenerateMinImageSrc(objectId, imageId);
            bool imageSrcExist = File.Exists(imageSrc);
            bool imageMinSrcExist = File.Exists(imageMinSrc);

            if (!imageSrcExist || !imageMinSrcExist)
            {
                GetImageById(imageId);
            }
        }
        #endregion
        
        #region BusinessCard
        private static async Task<ImageDataClass> SaveBusinessCardAsync(IFormFile file, StringValues objectId, int UserId)
        {
            int userId;
            Int32.TryParse(objectId.ToString(), out userId);
            if (UserId != 0)
                userId = UserId;

            var fullPath = GenerateImageSrc(userId, userId);
            var stream = new FileStream(fullPath, FileMode.Create);
            file.CopyTo(stream);

            byte[] imageArray = await File.ReadAllBytesAsync(fullPath);
            string imageSrc = GenerateImageSrc(userId, userId);
            string imageMinSrc = GenerateMinImageSrc(userId, userId);
            CreateImage(imageSrc, imageArray, true);
            CreateImage(imageMinSrc, imageArray, true);

            string storeProcedureName = "BusinessCardIns";
            ImageDataClass imageDataClassReturn = null;
            try
            {
                SqlConnection sqlConnection = new SqlConnection(ProgramSettings.ConnectionString);
                SqlCommand sqlCommand = new SqlCommand(storeProcedureName, sqlConnection);
                sqlCommand.CommandType = CommandType.StoredProcedure;

                sqlCommand.Parameters.Add("@userId", SqlDbType.Int).Value = userId;
                sqlCommand.Parameters.Add("@image", SqlDbType.Image).Value = imageArray;


                await sqlConnection.OpenAsync();
                await sqlCommand.ExecuteNonQueryAsync();
                await sqlConnection.CloseAsync();
                imageDataClassReturn = GetBusinessCard(userId);

                return imageDataClassReturn;
            }
            catch (Exception exception)
            {
                LoggerUtil.LogFunctionInfo("UpdateBusinessCard");
                LoggerUtil.LogException(exception.Message);
                throw new AppException("Снимката неуспешно е качена");
            }
        }
        public static string DeleteBusinessCard(long userId)
        {
            ImageDataClass imageDataClassItem = new ImageDataClass();
            string storeProcedureName = "BusinessCardDel";

            try
            {
                SqlConnection sqlConnection = new SqlConnection(ProgramSettings.ConnectionString);
                SqlCommand sqlCommand = new SqlCommand(storeProcedureName, sqlConnection);
                sqlCommand.CommandType = CommandType.StoredProcedure;

                sqlCommand.Parameters.Add("@userId", SqlDbType.BigInt).Value = userId;

                sqlConnection.Open();

                int result = sqlCommand.ExecuteNonQuery();

                sqlConnection.Close();
                if (result == 0)
                {
                    throw new Exception("Бизнес картата не можe да сбъде изтрита");
                }
                return "Бизнес картата е успещно изтрита";
            }
            catch (Exception exception)
            {
                LoggerUtil.LogFunctionInfo("deleteBusinessCard");
                LoggerUtil.LogException(exception.Message);
                throw new AppException($"Бизнес картата не можe да сбъде изтрита");
            }

        }
        public static ImageDataClass GetBusinessCard(int userId)
        {
            ImageDataClass imageDataClassReturn = null;

            try
            {
                string storeProcedureName = "BusinessCardGet";
                byte[] imageBytes = null;
                SqlConnection sqlConnection = new SqlConnection(ProgramSettings.ConnectionString);
                SqlCommand sqlCommand = new SqlCommand(storeProcedureName, sqlConnection);
                sqlCommand.CommandType = CommandType.StoredProcedure;

                sqlCommand.Parameters.Add("@userId", SqlDbType.Int).Value = userId;


                sqlConnection.Open();

                SqlDataReader sqlDataReader = sqlCommand.ExecuteReader();
                if (sqlDataReader.Read())
                {
                    imageDataClassReturn = new ImageDataClass();
                    imageBytes = (byte[])sqlDataReader["image"];
                    string base64ImageRepresentation = Convert.ToBase64String(imageBytes);
                    // imageDataClassReturn.imageDataClass = "data:image/jpg;base64," + base64ImageRepresentation;
                    imageDataClassReturn.ImageId = userId;
                }
                sqlConnection.Close();

                if (imageDataClassReturn != null)
                {
                    string imageSrc = GenerateImageSrc(userId, userId);
                    string imageMinSrc = GenerateMinImageSrc(userId, userId);
                    bool imageSrcExist = File.Exists(imageSrc);
                    bool imageMinSrcExist = File.Exists(imageMinSrc);

                    if (!imageSrcExist || !imageMinSrcExist)
                    {
                        if (!imageSrcExist)
                            CreateImage(imageSrc, imageBytes, false);
                        if (!imageMinSrcExist)
                            CreateImage(imageMinSrc, imageBytes, true);

                    }

                    imageSrc = GenerateImageHRef(userId, userId, false);
                    imageMinSrc = GenerateImageHRef(userId, userId, true);

                    imageDataClassReturn.ImageSrc = imageSrc;
                    imageDataClassReturn.ImageMinSrc = imageMinSrc;


                }
                return imageDataClassReturn;
            }
            catch (Exception exception)
            {
                LoggerUtil.LogFunctionInfo("getBusinessCard");
                LoggerUtil.LogException(exception.Message);
                throw new AppException($"Снимкатите не могат да се заредят");
            }

        }
        #endregion

        #region Get Main Images for array of ids
        public static async Task<IEnumerable<ImageDataClass>> GetMainImages(long[] ids)
        {
            List<ImageDataClass> images = new List<ImageDataClass>();
            foreach (long id in ids)
            {
                ImageDataClass mainImage = await GetMainImage(id);
                if (mainImage != null)
                {
                    images.Add(mainImage);
                }
            }

            return images;
        }
        #endregion
        
        #region Resize Image
        public static async Task<ImageDataClass[]> GetMinImagesAsync(long id)
        {
            try
            {
                return await GetImagesAsync(id);

                #region oldCode
                //List<ImageDataClass> images = new List<ImageDataClass>();

                //var pathToSave = Path.Combine(Program.ImageFolder, id.ToString());
                //if (!Directory.Exists(pathToSave))
                //    Directory.CreateDirectory(pathToSave);

                //string[] imageFiles = Directory.GetFiles(pathToSave);

                //foreach (string imageFile in imageFiles)
                //{
                //    if (imageFile.Contains("businessCard")) continue;
                //    byte[] imageArray = resizeImage(imageFile);
                //    string ImageDataClass = null;
                //    if (imageArray != null)
                //    {
                //        string base64ImageRepresentation = Convert.ToBase64String(imageArray);
                //        ImageDataClass = "data:image/jpg;base64," + base64ImageRepresentation;
                //    }

                //    string imgSrc_ = imageFile.Substring(Program.ImageFolder.Length + 1);

                //    images.Add(new ImageDataClass() { imageSrc = imgSrc_, imageDataClass = ImageDataClass });
                //}
                //return images.ToArray();
                #endregion
            }
            catch (Exception exception)
            {
                LoggerUtil.LogFunctionInfo("GetMinImages");
                LoggerUtil.LogException(exception.Message);
            }

            return null;
        }
        #endregion
        private static void resizeImage3(TargetSize targetSize, int multiplier, Stream input, Stream output)
        {
            try
            {
                var image = Image.FromStream(input);
                // Calculate the resize factor
                var scaleFactor = targetSize.CalculateScaleFactor(image.Width, image.Height);
                scaleFactor /= (int)multiplier;

                var newWidth = (int)Math.Floor(image.Width / scaleFactor);
                var newHeight = (int)Math.Floor(image.Height / scaleFactor);
                var newBitmap = new Bitmap(newWidth, newHeight);
                var imageScaler = Graphics.FromImage(newBitmap);
                imageScaler.CompositingQuality = CompositingQuality.HighSpeed;
                imageScaler.SmoothingMode = SmoothingMode.HighQuality;
                imageScaler.InterpolationMode = InterpolationMode.HighQualityBicubic;

                var imageRectangle = new Rectangle(0, 0, newWidth, newHeight);
                imageScaler.DrawImage(image, imageRectangle);

                // Fix orientation if needed.
                if (image.PropertyIdList.Contains(OrientationKey))
                {
                    var orientation = (int)image.GetPropertyItem(OrientationKey).Value[0];
                    switch (orientation)
                    {
                        case NotSpecified: // Assume it is good.
                        case NormalOrientation:
                            // No rotation required.
                            break;
                        case MirrorHorizontal:
                            newBitmap.RotateFlip(RotateFlipType.RotateNoneFlipX);
                            break;
                        case UpsideDown:
                            newBitmap.RotateFlip(RotateFlipType.Rotate180FlipNone);
                            break;
                        case MirrorVertical:
                            newBitmap.RotateFlip(RotateFlipType.Rotate180FlipX);
                            break;
                        case MirrorHorizontalAndRotateRight:
                            newBitmap.RotateFlip(RotateFlipType.Rotate90FlipX);
                            break;
                        case RotateLeft:
                            newBitmap.RotateFlip(RotateFlipType.Rotate90FlipNone);
                            break;
                        case MirorHorizontalAndRotateLeft:
                            newBitmap.RotateFlip(RotateFlipType.Rotate270FlipX);
                            break;
                        case RotateRight:
                            newBitmap.RotateFlip(RotateFlipType.Rotate270FlipNone);
                            break;
                        default:
                            throw new NotImplementedException("An orientation of " + orientation + " isn't implemented.");
                    }
                }
                newBitmap.Save(output, image.RawFormat);
            }
            catch (Exception ex)
            {
                LoggerUtil.LogException(ex.Message);
            }
        }
        public static async Task<ImageDataClass> UploadWebCameraImageAsync(int userId, WebCamImage webCamImage)
        {
            if (userId == 0) { return null; }
            var pathToSave = Path.Combine(ProgramSettings.ImageFolder, webCamImage.itemId.ToString());

            if (!Directory.Exists(pathToSave))
                Directory.CreateDirectory(pathToSave);

            var fullPath = pathToSave + "\\" + webCamImage.imageId + ".jpeg"; 
            await File.WriteAllBytesAsync(fullPath, Convert.FromBase64String(webCamImage.image));

            return await SaveImageAsync(fullPath, userId, webCamImage.itemId);
        }

        public static Bitmap ResizeImage(Image imgToResize, Size size)
        {
            //Get the image current width  
            int sourceWidth = imgToResize.Width;
            //Get the image current height  
            int sourceHeight = imgToResize.Height;
            float nPercent = 0;
            float nPercentW = 0;
            float nPercentH = 0;
            //Calulate  width with new desired size  
            nPercentW = ((float)size.Width / (float)sourceWidth);
            //Calculate height with new desired size  
            nPercentH = ((float)size.Height / (float)sourceHeight);
            if (nPercentH < nPercentW)
                nPercent = nPercentH;
            else
                nPercent = nPercentW;
            //New Width  
            int destWidth = (int)(sourceWidth * nPercent);
            //New Height  
            int destHeight = (int)(sourceHeight * nPercent);
            Bitmap b = new Bitmap(destWidth, destHeight);
            Graphics g = Graphics.FromImage((System.Drawing.Image)b);
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            // Draw image with new width and height  
            g.DrawImage(imgToResize, 0, 0, destWidth, destHeight);
            g.Dispose();
            return b;
        }
        public static async Task<ImageDataClass[]> UploadFiles(HttpRequest httpRequest, int userId)
        {
            try
            {
                httpRequest.Form.TryGetValue("partId", out var objectId);
                var files = httpRequest.Form.Files;
                var objectIdList = objectId.ToString().Split(',').Select(long.Parse).ToList();

                long id = Convert.ToInt64(objectId.ToString());

                int count = await GetImageCount(id);

                if (ProgramSettings.ImageFolder != null)
                {
                    var pathToSave = Path.Combine(ProgramSettings.ImageFolder, objectId.ToString());

                    if (!Directory.Exists(pathToSave))
                        Directory.CreateDirectory(pathToSave);
                }

                if (files.Any(f => f.Length == 0))
                {
                    return null;
                }

                List<ImageDataClass> images = new List<ImageDataClass>();
                if (files.Count == 1 && files[0].FileName.ToLower().Contains("businesscard"))
                {
                    string fullPath = GetPhotosPath(objectIdList[0]);
                    Directory.CreateDirectory(fullPath);

                    ImageDataClass businessCardImage = await SaveBusinessCardAsync(files[0], objectId, userId);
                    images.Add(businessCardImage);

                    return images.ToArray();
                }

                foreach (var file in files)
                {
                    if (count >= ProgramSettings.MaxPictures)
                    {
                        throw (new MaxCountPictureException($"Максималният брой снимки за обява от {ProgramSettings.MaxPictures} е достигнат"));
                    }

                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName?.Trim('"');
                    string fullPath = GetPhotosPath(objectIdList[0]);
                    Directory.CreateDirectory(fullPath);

                    fullPath = fullPath + fileName;

                    await using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    ImageDataClass? image = await SaveImageAsync(fullPath, userId, objectIdList[0].ToString());
                    if (image != null)
                        images.Add(image);
                    else
                    {
                        throw new Exception("Failed to save image");
                    }
                    File.Delete(fullPath);
                    count++;
                }

                CheckImageCount(id);
                return images.ToArray();
            }
            catch (MaxCountPictureException exception)
            {
                LoggerUtil.LogFunctionInfo("Upload");
                LoggerUtil.LogException(exception.Message);
                throw new Exception(exception.Message);
            }
            catch (Exception exception)
            {
                LoggerUtil.LogFunctionInfo("Upload");
                LoggerUtil.LogException(exception.Message);
                throw new Exception(exception.Message);
            }
        }

        #region catcha
        public static Catcha GenerateCaptchaImage()
        {
            StringBuilder captchaText = new StringBuilder();
            int width = 400;
            int height = 100;
            Random rndInt = new Random();

            for (int i = 0; i < 5; i++)
            {
                int number = rndInt.Next(1, 9);
                captchaText.Append(number.ToString());

            }

            int id = rndInt.Next();
            while (catchaCache.ContainsKey(id))
            {
                id = rndInt.Next();
            }
            catchaCache.Add(id, captchaText.ToString());
            //First declare a bitmap and declare graphic from this bitmap
            Bitmap bitmap = new Bitmap(width, height, PixelFormat.Format32bppArgb);
            Graphics g = Graphics.FromImage(bitmap);
            //And create a rectangle to delegete this image graphic 
            Rectangle rect = new Rectangle(0, 0, width, height);
            //And create a brush to make some drawings
            HatchBrush hatchBrush = new HatchBrush(HatchStyle.DottedGrid, Color.Aqua, Color.White);
            g.FillRectangle(hatchBrush, rect);

            //here we make the text configurations
            GraphicsPath graphicPath = new GraphicsPath();
            //add this string to image with the rectangle delegate
            graphicPath.AddString(captchaText.ToString(), FontFamily.GenericMonospace, (int)FontStyle.Bold, 90, rect, null);
            //And the brush that you will write the text
            hatchBrush = new HatchBrush(HatchStyle.Percent20, Color.Black, Color.GreenYellow);
            g.FillPath(hatchBrush, graphicPath);
            //We are adding the dots to the image
            Random rnd = new Random();

            for (int i = 0; i < (int)(rect.Width * rect.Height / 50F); i++)
            {
                int x = rnd.Next(width);
                int y = rnd.Next(height);
                int w = rnd.Next(10);
                int h = rnd.Next(10);
                g.FillEllipse(hatchBrush, x, y, w, h);
            }
            //Remove all of variables from the memory to save resource
            hatchBrush.Dispose();
            g.Dispose();

            Byte[] imageArray;

            using (var memoryStream = new MemoryStream())
            {
                bitmap.Save(memoryStream, ImageFormat.Bmp);

                imageArray = memoryStream.ToArray();
            }

            string base64ImageRepresentation = Convert.ToBase64String(imageArray);
            string imageString = "data:image/jpg;base64," + base64ImageRepresentation;
            Catcha catcha = new Catcha() { imageId = id, imageData = imageString };

            return catcha;
        }

        public static bool VerifyCatcha(CatchaItem catchaItem)
        {
            if (catchaCache.ContainsKey(catchaItem.id))
            {
                if (catchaCache[catchaItem.id] == catchaItem.catchaText)
                {
                    return true;
                }
            }
            return false;
        }
        #endregion

        #region not used
        //private static byte[] getImage(string imageFileName)
        //{
        //    try
        //    {
        //        long startTime = Environment.TickCount;
        //        Image img;
        //        if (File.Exists(imageFileName))
        //        {
        //            using (FileStream fileStream = new FileStream(imageFileName, FileMode.Open, FileAccess.Read))
        //            {
        //                img = System.Drawing.Image.FromStream(fileStream);
        //                using (var oututStream = new MemoryStream())
        //                {
        //                    img.Save(oututStream, ImageFormat.Jpeg);
        //                    Task.Run(() => LoggerUtil.Log(string.Format("Load Minimazed Image {0}", Environment.TickCount - startTime), Environment.TickCount));
        //                    return oututStream.ToArray();
        //                }
        //            }

        //        }
        //    }
        //    catch (Exception exception)
        //    {
        //        LoggerUtil.Log(exception);
        //    }

        //    return null;
        //}

        //private static byte[] CreateMinImage(string imageFileName)
        //{
        //    try
        //    {
        //        int startTime = Environment.TickCount;
        //        string imageFileNameMin = generateMinImageFileName(imageFileName);

        //        FileStream fileStream = new FileStream(imageFileName, FileMode.Open, FileAccess.Read);
        //        Image img = System.Drawing.Image.FromStream(fileStream);


        //        Task.Run(() => LoggerUtil.Log(string.Format("Read file from disk {0}", Environment.TickCount - startTime), Environment.TickCount));
        //        ImageConverter _imageConverter = new ImageConverter();
        //        var inputStream = new MemoryStream();
        //        var oututStream = new MemoryStream();
        //        img.Save(inputStream, ImageFormat.Jpeg);
        //        TargetSize targetSize = new TargetSize(400, 400);

        //        resizeImage3(targetSize, 2, inputStream, oututStream);
        //        Task.Run(() => LoggerUtil.Log(string.Format("ResizeImage3 {0}", Environment.TickCount - startTime), Environment.TickCount));
        //        MemoryStream mem = new MemoryStream();
        //        mem.CopyTo(oututStream);
        //        var yourImage = Image.FromStream(oututStream);

        //        yourImage.Save(imageFileNameMin, ImageFormat.Jpeg);
        //        yourImage.Dispose();

        //        return oututStream.ToArray();
        //    }
        //    catch (Exception exception)
        //    {
        //        LoggerUtil.LogFunctionInfo("CreateMinImage");
        //        LoggerUtil.LogException(exception.Message);
        //    }

        //    return null;
        //}

        //public static byte[] converterDemo(Image x)
        //{
        //    ImageConverter _imageConverter = new ImageConverter();
        //    byte[] xByte = (byte[])_imageConverter.ConvertTo(x, typeof(byte[]));
        //    return xByte;
        //}

        //public static void SaveJpegImage(string imageName, MemoryStream memoryStream)
        //{
        //    var yourImage = Image.FromStream(memoryStream);
        //    yourImage.Save(imageName, ImageFormat.Jpeg);
        //}

        //private static string getMainImageFromDb(long id)
        //{
        //    string mainPicture = "";
        //    int startTime = Environment.TickCount;
        //    try
        //    {
        //        using (SqlConnection sqlConnection = new SqlConnection(ProgramSettings.ConnectionString))
        //        {
        //            string storedProcedure = "GetMainPicture";
        //            sqlConnection.Open();
        //            using (SqlCommand sqlCommand = new SqlCommand(storedProcedure, sqlConnection))
        //            {
        //                sqlCommand.CommandType = CommandType.StoredProcedure;

        //                sqlCommand.Parameters.Add("@id", SqlDbType.BigInt).Value = id;

        //                SqlParameter mainPictureParam = sqlCommand.Parameters.Add("@mainPicture", SqlDbType.NVarChar, 200);
        //                mainPictureParam.Direction = ParameterDirection.Output;
        //                mainPictureParam.Value = "";

        //                SqlParameter returnParameter = sqlCommand.Parameters.Add("@ReturnVal", SqlDbType.Int);
        //                returnParameter.Direction = ParameterDirection.ReturnValue;

        //                using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
        //                {
        //                    sqlDataReader.Read();

        //                    Task.Run(() => LoggerUtil.Log(string.Format("GetMainPicture SQL {0}", Environment.TickCount - startTime), Environment.TickCount));
        //                    mainPicture = (string)mainPictureParam.Value;

        //                    return mainPicture;
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception exception)
        //    {
        //        LoggerUtil.LogFunctionInfo("getMainImageFromDb");
        //        LoggerUtil.LogException(exception.Message);
        //    }
        //    finally
        //    {

        //    }

        //    return mainPicture;
        //}

        //private static string getMainImageFromFolder(long id)
        //{
        //    string imageFile = "";
        //    try
        //    {
        //        var pathToSave = Path.Combine(ProgramSettings.ImageFolder, id.ToString());
        //        if (Directory.Exists(pathToSave))
        //        {
        //            string[] imageFiles = Directory.GetFiles(pathToSave);
        //            if (imageFiles.Length > 0)
        //            {
        //                imageFile = imageFiles[0];
        //            }
        //        }
        //    }
        //    catch (Exception exception)
        //    {
        //        throw new AppException(exception.Message);
        //    }

        //    return imageFile;

        //}


        //void RenameFolder(int partOld, int partNew)
        //{
        //    var pathOld = Path.Combine(ProgramSettings.ImageFolder, partOld.ToString());
        //    var pathNew = Path.Combine(ProgramSettings.ImageFolder, partNew.ToString());
        //}

        //public static Image resizeImage(Image imgToResize, Size size)
        //{
        //    return (Image)(new Bitmap(imgToResize, size));
        //}
        //private static ImageCodecInfo GetEncoder(ImageFormat format)
        //{
        //    ImageCodecInfo[] codecs = ImageCodecInfo.GetImageEncoders();
        //    foreach (ImageCodecInfo codec in codecs)
        //    {
        //        if (codec.FormatID == format.Guid)
        //        {
        //            return codec;
        //        }
        //    }
        //    return null;
        //}

        //public static byte[] Test(string image)
        //{
        //    Bitmap bmp1 = new Bitmap(image);
        //    ImageCodecInfo jpgEncoder = GetEncoder(ImageFormat.Jpeg);

        //    // Create an Encoder object based on the GUID  
        //    // for the Quality parameter category.  
        //    System.Drawing.Imaging.Encoder myEncoder =
        //        System.Drawing.Imaging.Encoder.Quality;

        //    // Create an EncoderParameters object.  
        //    // An EncoderParameters object has an array of EncoderParameter  
        //    // objects. In this case, there is only one  
        //    // EncoderParameter object in the array.  
        //    EncoderParameters myEncoderParameters = new EncoderParameters(1);

        //    EncoderParameter myEncoderParameter = new EncoderParameter(myEncoder, 25L);
        //    myEncoderParameters.Param[0] = myEncoderParameter;
        //    using (MemoryStream mStream = new MemoryStream())
        //    {
        //        bmp1.Save(mStream, jpgEncoder, myEncoderParameters);
        //        return mStream.ToArray();
        //    }

        //}
        //private static ImageCodecInfo GetEncoderInfo(string mimeType)
        //{
        //    int j;
        //    ImageCodecInfo[] encoders;
        //    encoders = ImageCodecInfo.GetImageEncoders();
        //    for (j = 0; j < encoders.Length; ++j)
        //    {
        //        if (encoders[j].MimeType == mimeType)
        //            return encoders[j];
        //    }
        //    return null;
        //}
        //public static void ArchiveData(byte[] origin)
        //{

        //    using (var memoryStream = new MemoryStream())
        //    {
        //        using var compressor = new GZipStream(memoryStream, CompressionLevel.SmallestSize, leaveOpen: true);
        //        compressor.Write(origin, 0, origin.Length);
        //        compressor.Close();
        //    }

        //    byte[] btZipped = null;

        //    using (var memoryStream = new MemoryStream())
        //    {
        //        using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, false))
        //        {

        //            var entry = archive.CreateEntry("entry.bin");

        //            using (var entryStream = entry.Open())
        //            using (var streamWriter = new BinaryWriter(entryStream))
        //            {
        //                streamWriter.Write(origin, 0, origin.Length);
        //            }

        //        }

        //        btZipped = memoryStream.ToArray();
        //    }
        //}

        //private static byte[] resizeImage(string imageFileName)
        //{
        //    try
        //    {
        //        string imageFileNameMin = generateMinImageFileName(imageFileName);

        //        int startTime = Environment.TickCount;

        //        if (File.Exists(imageFileNameMin))
        //        {
        //            return getImage(imageFileNameMin);
        //        }
        //        else
        //        {
        //            return CreateMinImage(imageFileName);
        //        }
        //    }
        //    catch (Exception exception)
        //    {
        //        LoggerUtil.LogException(string.Format("{0} {1}", System.Reflection.MethodBase.GetCurrentMethod().Name, imageFileName));
        //        LoggerUtil.LogException(exception.Message);
        //    }

        //    return null;
        //}
        //private void GenerateThumbnails(double scaleFactor, Stream sourcePath, string targetPath)
        //{
        //    using (var image = Image.FromStream(sourcePath))
        //    {
        //        var newWidth = (int)(image.Width * scaleFactor);
        //        var newHeight = (int)(image.Height * scaleFactor);
        //        var thumbnailImg = new Bitmap(newWidth, newHeight);
        //        var thumbGraph = Graphics.FromImage(thumbnailImg);
        //        thumbGraph.CompositingQuality = CompositingQuality.HighQuality;
        //        thumbGraph.SmoothingMode = SmoothingMode.HighQuality;
        //        thumbGraph.InterpolationMode = InterpolationMode.HighQualityBicubic;
        //        var imageRectangle = new Rectangle(0, 0, newWidth, newHeight);
        //        thumbGraph.DrawImage(image, imageRectangle);
        //        thumbnailImg.Save(targetPath, image.RawFormat);
        //    }
        //}

        //private static string GetmainPictureStr(long objectId)
        //{
        //    ImageDataClass imageDataClassItem = new ImageDataClass();
        //    string storeProcedureName = "GetMainImageAsync";
        //    string mainPicture = "";

        //    try
        //    {
        //        using (SqlConnection sqlConnection = new SqlConnection(ProgramSettings.ConnectionString))
        //        {

        //            using (SqlCommand sqlCommand = new SqlCommand(storeProcedureName, sqlConnection))
        //            {
        //                sqlCommand.CommandType = CommandType.StoredProcedure;

        //                sqlCommand.Parameters.Add("@id", SqlDbType.BigInt).Value = objectId;

        //                sqlConnection.Open();

        //                using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
        //                {
        //                    if (sqlDataReader.Read())
        //                    {
        //                        mainPicture = (string)sqlDataReader["mainPicture"];
        //                    }
        //                }
        //                sqlConnection.Close();
        //                return mainPicture;
        //            }
        //        }
        //    }
        //    catch (Exception exception)
        //    {
        //        throw new AppException($"Снимкатите не могат да се заредят {exception.Message}");
        //    }

        //}
        //public static void RecoverImages()
        //{
        //    string storeProcedureName = "ImageDataAll";
        //    try
        //    {
        //        SqlConnection sqlConnection = new SqlConnection(ProgramSettings.ConnectionString);
        //        SqlCommand sqlCommand = new SqlCommand(storeProcedureName, sqlConnection);
        //    }
        //    catch (Exception ex)
        //    {
        //        LoggerUtil.LogException(ex.Message);
        //    }
        //}

        //public static Image String64ToImage(byte[] bytes)
        //{
        //    MemoryStream ms = new MemoryStream(bytes);
        //    Image image = Image.FromStream(ms);

        //    return image;
        //}

        //public static int GetUserId(long id)
        //{
        //    int userId = 0;
        //    string storeProcedureName = "GetUserId";
        //    try
        //    {
        //        using (SqlConnection sqlConnection = new SqlConnection(ProgramSettings.ConnectionString))
        //        {

        //            using (SqlCommand sqlCommand = new SqlCommand(storeProcedureName, sqlConnection))
        //            {
        //                sqlCommand.CommandType = CommandType.StoredProcedure;

        //                sqlCommand.Parameters.Add("@id", SqlDbType.BigInt).Value = id;

        //                sqlConnection.Open();

        //                using (SqlDataReader sqlDataReader = sqlCommand.ExecuteReader())
        //                {
        //                    if (sqlDataReader.Read())
        //                    {
        //                        userId = (int)sqlDataReader["userId"];
        //                    }
        //                }
        //                sqlConnection.Close();
        //                return userId;
        //            }
        //        }
        //    }
        //    catch (Exception exception)
        //    {
        //        LoggerUtil.LogFunctionInfo("GetUserId");
        //        LoggerUtil.LogException(exception.Message);
        //        throw new AppException($"Снимкатите не могат да се заредят");
        //    }
        //}

        //public static Bitmap ResizeImage(Image image, int width, int height)
        //{
        //    int sourceWidth = image.Width;
        //    //Get the image current height  
        //    int sourceHeight = image.Height;
        //    float nPercent = 0;
        //    float nPercentW = 0;
        //    float nPercentH = 0;
        //    //Calulate  width with new desired size  
        //    nPercentW = ((float)width / (float)sourceWidth);
        //    //Calculate height with new desired size  
        //    nPercentH = ((float)height / (float)sourceHeight);
        //    if (nPercentH < nPercentW)
        //        nPercent = nPercentH;
        //    else
        //        nPercent = nPercentW;
        //    //New Width  
        //    int destWidth = (int)(sourceWidth * nPercent);
        //    //New Height  
        //    int destHeight = (int)(sourceHeight * nPercent);


        //    var destRect = new Rectangle(0, 0, width, height);
        //    var destImage = new Bitmap(width, height);

        //    destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

        //    using (var graphics = Graphics.FromImage(destImage))
        //    {
        //        graphics.CompositingMode = CompositingMode.SourceCopy;
        //        graphics.CompositingQuality = CompositingQuality.HighQuality;
        //        graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
        //        graphics.SmoothingMode = SmoothingMode.HighQuality;
        //        graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

        //        using (var wrapMode = new ImageAttributes())
        //        {
        //            wrapMode.SetWrapMode(WrapMode.TileFlipXY);
        //            graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
        //        }
        //    }

        //    return destImage;
        //}
        #endregion
    }
}

#region Commented
//static private ImageDataClass getMainImage(long id, string imageFile)
//{
//    ImageDataClass image = null;
//    int startTime = Environment.TickCount;
//    try
//    {
//        if (imageFile == "")
//        {
//            imageFile = getMainImageFromDb(id);
//        }
//        if (imageFile == "")
//        {
//            imageFile = getMainImageFromFolder(id);
//        }

//        image = getMinImage(imageFile);
//        Task.Run(() => Logger.Log(ToString.Format("GetPicture {0} {1}", Environment.TickCount - startTime, id), Environment.TickCount));
//        if (image != null) image.imageId = (int)id;
//    }
//    catch (Exception exception)
//    {
//        throw new AppException(exception.Message);
//    }
//    return image;
//}


//static public ImageDataClass[] GetImages(long id)
//{
//    try
//    {
//        return GetImages(id);

//        #region oldCode
//        //List<ImageDataClass> images = new List<ImageDataClass>();

//        //var pathToSave = Path.Combine(Program.ImageFolder, id.ToString());
//        //if (!Directory.Exists(pathToSave))
//        //    Directory.CreateDirectory(pathToSave);

//        //string[] imageFiles = Directory.GetFiles(pathToSave);

//        //foreach (string imageFile in imageFiles)
//        //{
//        //    if (imageFile.Contains("businessCard")) continue;
//        //    byte[] imageArray = getImage(imageFile);
//        //    string ImageDataClass = null;
//        //    if (imageArray != null)
//        //    {
//        //        string base64ImageRepresentation = Convert.ToBase64String(imageArray);
//        //        ImageDataClass = "data:image/jpg;base64," + base64ImageRepresentation;
//        //    }

//        //    string imgSrc_ = imageFile.Substring(Program.ImageFolder.Length + 1);

//        //    images.Add(new ImageDataClass() { imageSrc = imgSrc_, imageDataClass = ImageDataClass });
//        //}
//        //return images.ToArray();
//        #endregion
//    }
//    catch (Exception exception)
//    {
//        LoggerUtil.LogFunctionInfo("GetImages");
//        LoggerUtil.LogException(exception.Message);
//    }

//    return null;
//}

//            MemoryStream mem = new MemoryStream();
//            mem.CopyTo(oututStream);
//            var yourImage = Image.FromStream(oututStream);

//            yourImage.Save(image, ImageFormat.Jpeg);
//            yourImage.Dispose();
////            img = ResizeImage(img, new Size(800, 600));

//            using (var inputStream = new MemoryStream())
//            {
//                using (var oututStream = new MemoryStream())
//                {
//                    img.Save(inputStream, ImageFormat.Jpeg);
//                    TargetSize targetSize = new TargetSize(400, 400);

//                    resizeImage3(targetSize, 2, inputStream, oututStream);
//                    Task.Run(() => LoggerUtil.Log(ToString.Format("ResizeImage3 {0}", Environment.TickCount - startTime), Environment.TickCount));
//                    MemoryStream mem = new MemoryStream();
//                    mem.CopyTo(oututStream);
//                    var yourImage = Image.FromStream(oututStream);

//                    yourImage.Save(imageFileNameMin, ImageFormat.Jpeg);
//                    yourImage.Dispose();

//                    return oututStream.ToArray();
//                }
//            }


//        }


//       byte[] btDecomp = new byte[btmod.Length];

//using (var memoryStream = new MemoryStream(btZipped))
//           {
//               using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Read))
//               {
//                   var entry = archive.GetEntry("entry.bin");

//                   using (var entryStream = entry.Open())
//                   using (var streamReader = new BinaryReader(entryStream))
//                   {
//                       streamReader.Read(btDecomp, 0, btDecomp.Length);
//                   }

//               }
//           }




//public void ResizeImage(TargetSize targetSize, ResizeMultiplier multiplier, Stream input, Stream output)
//{
//    using (var image = Image.FromStream(input))
//    {
//        // Calculate the resize factor
//        var scaleFactor = targetSize.CalculateScaleFactor(image.Width, image.Height);
//        scaleFactor /= (int)multiplier;

//        var newWidth = (int)Math.Floor(image.Width / scaleFactor);
//        var newHeight = (int)Math.Floor(image.Height / scaleFactor);
//        using (var newBitmap = new Bitmap(newWidth, newHeight))
//        {
//            using (var imageScaler = Graphics.FromImage(newBitmap))
//            {
//                imageScaler.CompositingQuality = CompositingQuality.HighQuality;
//                imageScaler.SmoothingMode = SmoothingMode.HighQuality;
//                imageScaler.InterpolationMode = InterpolationMode.HighQualityBicubic;

//                var imageRectangle = new Rectangle(0, 0, newWidth, newHeight);
//                imageScaler.DrawImage(image, imageRectangle);

//                // Fix orientation if needed.
//                if (image.PropertyIdList.Contains(OrientationKey))
//                {
//                    var orientation = (int)image.GetPropertyItem(OrientationKey).Value[0];
//                    switch (orientation)
//                    {
//                        case NotSpecified: // Assume it is good.
//                        case NormalOrientation:
//                            // No rotation required.
//                            break;
//                        case MirrorHorizontal:
//                            newBitmap.RotateFlip(RotateFlipType.RotateNoneFlipX);
//                            break;
//                        case UpsideDown:
//                            newBitmap.RotateFlip(RotateFlipType.Rotate180FlipNone);
//                            break;
//                        case MirrorVertical:
//                            newBitmap.RotateFlip(RotateFlipType.Rotate180FlipX);
//                            break;
//                        case MirrorHorizontalAndRotateRight:
//                            newBitmap.RotateFlip(RotateFlipType.Rotate90FlipX);
//                            break;
//                        case RotateLeft:
//                            newBitmap.RotateFlip(RotateFlipType.Rotate90FlipNone);
//                            break;
//                        case MirorHorizontalAndRotateLeft:
//                            newBitmap.RotateFlip(RotateFlipType.Rotate270FlipX);
//                            break;
//                        case RotateRight:
//                            newBitmap.RotateFlip(RotateFlipType.Rotate270FlipNone);
//                            break;
//                        default:
//                            throw new NotImplementedException("An orientation of " + orientation + " isn't implemented.");
//                    }
//                }
//                newBitmap.Save(output, image.RawFormat);
//            }
//        }
//    }
//}

//public static Bitmap ResizeImage2(Image image, int maxWidth, int maxHeight)
//{

//    double aspectRatio = image.Width / image.Height;
//    double boxRatio = maxWidth / maxHeight;
//    double scaleFactor = 0;

//    if (boxRatio > aspectRatio) //Use height, since that is the most restrictive dimension of box. 
//        scaleFactor = maxHeight / image.Height;
//    else
//        scaleFactor = maxWidth / image.Width;

//    double newWidth = image.Width * scaleFactor;
//    double newHeight = image.Height * scaleFactor;

//    var destRect = new Rectangle(0, 0, (int)newWidth, (int)newHeight);
//    var destImage = new Bitmap((int)newWidth, (int)newHeight);

//    destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);

//    using (var graphics = Graphics.FromImage(destImage))
//    {
//        graphics.CompositingMode = CompositingMode.SourceCopy;
//        graphics.CompositingQuality = CompositingQuality.HighQuality;
//        graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
//        graphics.SmoothingMode = SmoothingMode.HighQuality;
//        graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

//        using (var wrapMode = new ImageAttributes())
//        {
//            wrapMode.SetWrapMode(WrapMode.TileFlipXY);
//            graphics.DrawImage(image, destRect, 0, 0, image.Width, image.Height, GraphicsUnit.Pixel, wrapMode);
//        }
//    }

//    return destImage;
//}

/// <summary>
/// Resize the image to the specified width and height.
/// </summary>
/// <param name="image">The image to resize.</param>
/// <param name="width">The width to resize to.</param>
/// <param name="height">The height to resize to.</param>
/// <returns>The resized image.</returns>
//public static Bitmap ResizeImage(Image image, int newWidth, int newHeight)
//{
//    var destRect = new Rectangle(0, 0, newWidth, newHeight);
//    var destImage = new Bitmap(newWidth, newHeight);

//    destImage.SetResolution(image.HorizontalResolution, image.VerticalResolution);
//    int sourceWidth = image.Width;
//    int sourceHeight = image.Height;

//    //Consider vertical pics
//    if (sourceWidth < sourceHeight)
//    {
//        int buff = newWidth;

//        newWidth = newHeight;
//        newHeight = buff;
//    }

//    using (var graphics = Graphics.FromImage(destImage))
//    {
//        graphics.CompositingMode = CompositingMode.SourceCopy;
//        graphics.CompositingQuality = CompositingQuality.HighQuality;
//        graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
//        graphics.SmoothingMode = SmoothingMode.HighQuality;
//        graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;

//        using (var wrapMode = new ImageAttributes())
//        {
//            wrapMode.SetWrapMode(WrapMode.TileFlipXY);
//            graphics.DrawImage(image, destRect, 0, 0, newWidth, newHeight, GraphicsUnit.Pixel, wrapMode);
//        }
//    }

//    return destImage;
//}

//public Image resizeImage(int newWidth, int newHeight, string stPhotoPath)
//{
//    Image imgPhoto = Image.FromFile(stPhotoPath);

//    int sourceWidth = imgPhoto.Width;
//    int sourceHeight = imgPhoto.Height;

//    //Consider vertical pics
//    if (sourceWidth < sourceHeight)
//    {
//        int buff = newWidth;

//        newWidth = newHeight;
//        newHeight = buff;
//    }

//    int sourceX = 0, sourceY = 0, destX = 0, destY = 0;
//    float nPercent = 0, nPercentW = 0, nPercentH = 0;

//    nPercentW = ((float)newWidth / (float)sourceWidth);
//    nPercentH = ((float)newHeight / (float)sourceHeight);
//    if (nPercentH < nPercentW)
//    {
//        nPercent = nPercentH;
//        destX = System.Convert.ToInt16((newWidth -
//                  (sourceWidth * nPercent)) / 2);
//    }
//    else
//    {
//        nPercent = nPercentW;
//        destY = System.Convert.ToInt16((newHeight -
//                  (sourceHeight * nPercent)) / 2);
//    }

//    int destWidth = (int)(sourceWidth * nPercent);
//    int destHeight = (int)(sourceHeight * nPercent);


//    Bitmap bmPhoto = new Bitmap(newWidth, newHeight,
//                  PixelFormat.Format24bppRgb);

//    bmPhoto.SetResolution(imgPhoto.HorizontalResolution,
//                 imgPhoto.VerticalResolution);

//    Graphics grPhoto = Graphics.FromImage(bmPhoto);
//    grPhoto.Clear(Color.Black);
//    grPhoto.InterpolationMode =
//        System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;

//    grPhoto.DrawImage(imgPhoto,
//        new Rectangle(destX, destY, destWidth, destHeight),
//        new Rectangle(sourceX, sourceY, sourceWidth, sourceHeight),
//        GraphicsUnit.Pixel);

//    grPhoto.Dispose();
//    imgPhoto.Dispose();
//    return bmPhoto;
//}

//static ImageDataClass getBusinessCardImage(long userId)
//{
//    return getBusinessCard(userId);
//    //var pathToSave = Path.Combine(Program.ImageFolder, id.ToString());
//    //if (!Directory.Exists(pathToSave))
//    //    Directory.CreateDirectory(pathToSave);

//    //string[] files = Directory.GetFiles(pathToSave);
//    //foreach(string file in files) {
//    //    if (file.Contains("businessCard"))
//    //        return getMinImage(file);
//    //}

//    //return null;
//}

//#region delete image
//public static void DeleteImage(string imageFileName)
//{
//    try
//    {
//        var fullName = Path.Combine(Program.ImageFolder, imageFileName);
//        System.IO.File.Delete(fullName);

//        string minImageName = generateMinImageFileName(imageFileName);
//        fullName = Path.Combine(Program.ImageFolder, minImageName);
//        System.IO.File.Delete(fullName);
//    }
//    catch (Exception exception)
//    {
//        Logger.Log(exception);
//    }
//}
//#endregion

//static public ImageDataClass GetMainImageFromFile(long id, string imageFile)
//{
//    imageFile = imageFile!.Trim();
//    if (imageFile.Length == 0) return null;
//    string minImageFileName = generateMinImageFileName(imageFile);

//    try
//    {
//        return getMainImage(id, imageFile);
//    }
//    catch (Exception exception)
//    {
//        Logger.Log(exception); ;
//    }

//    return null;
//}

//ImageDataClass getMinImageDataFromFile(long id, string imageFileName)
//{
//    ImageDataClass imageDataClass = null;
//    try
//    {
//        string minImageFileName = generateMinImageFileName(imageFileName);

//        byte[] imageArray = getImage(minImageFileName);
//        string ImageDataClass = null;
//        if (imageArray != null)
//        {
//            string base64ImageRepresentation = Convert.ToBase64String(imageArray);
//            ImageDataClass = "data:image/jpg;base64," + base64ImageRepresentation;
//        }

//        string imgSrc_ = imageFileName.Substring(Program.ImageFolder.Length + 1);

//        imageDataClass = new ImageDataClass() { imageSrc = imgSrc_, imageDataClass = ImageDataClass };
//    }
//    catch (Exception exception)
//    {
//        Logger.Log(exception);

//    }

//    return imageDataClass;
//}

//#region Get Main Image part / car 
//static public ImageDataClass GetMainImageAsync(long id, string imageFile)
//{
//    imageFile = imageFile!.Trim();
//    if (imageFile.Length == 0) return null;
//    try
//    {
//        return getMainImage(id, imageFile);
//    }
//    catch (Exception exception)
//    {
//        Logger.Log(exception);
//    }

//    return null;
//}

//#endregion
//static private ImageDataClass getMinImage(string imageFileName)
//{
//    try
//    {
//        imageFileName = imageFileName!.Trim();
//        imageFileName = Path.Combine(Program.ImageFolder, imageFileName);

//        int startTime = Environment.TickCount;
//        if (!File.Exists(imageFileName))
//            return null;

//        byte[] imageArray = resizeImage(imageFileName);

//        Task.Run(() => Logger.Log(ToString.Format("Resizing Image {0}", Environment.TickCount - startTime), Environment.TickCount));

//        string base64ImageRepresentation = Convert.ToBase64String(imageArray);
//        string imageString = "data:image/jpg;base64," + base64ImageRepresentation;
//        string imgSrc_ = imageFileName.Substring(Program.ImageFolder.Length + 1);

//        Task.Run(() => Logger.Log(ToString.Format("Converting Image {0}", Environment.TickCount - startTime), Environment.TickCount));

//        ImageDataClass image = new ImageDataClass() { imageSrc = imgSrc_, imageDataClass = imageString };
//        return image;

//    }
//    catch(Exception exception)
//    {
//        Logger.Log(exception);
//    }

//    return null;
//}

/*
         public static byte[] ResizeImage(byte[] imageBytes)
   {
       try
       {
           MemoryStream memoryStream = new MemoryStream(imageBytes);
           MemoryStream oututStream = new MemoryStream();
           TargetSize targetSize = new TargetSize(400, 400);
           resizeImage3(targetSize, 1, memoryStream, oututStream);
           imageBytes = oututStream.ToArray();
       }
       catch (Exception ex)
       {
           LoggerUtil.LogException(ex);
       } 

       return imageBytes;
   }

*/

#endregion
