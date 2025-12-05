using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;
using Image = System.Drawing.Image;

namespace ImageConvertor
{
    public class Converter
    {
        public static string folder = "D:\\Angular\\Rado\\Rado\\obj\\Debug\\net8.0\\PubTmp\\Out\\part365\\dist\\part365\\browser\\photos\\1676412873551";
        public static string fileName = "197.jpeg";
        public static string newfolder = "D:\\Angular\\Rado\\Rado\\obj\\Debug\\net8.0\\PubTmp\\Out\\part365\\dist\\part365\\browser\\photos\\1676412873551";
        public static string newFileName = "197.min.jpeg";


        void resize(Size original)
        {
            int maxSize = 100;

            float percent = (new List<float> { (float)maxSize / (float)original.Width, (float)maxSize / (float)original.Height }).Min();

            Size resultSize = new Size((int)Math.Floor(original.Width * percent), (int)Math.Floor(original.Height * percent));
        }

        public static void ResizeImage(string originalPath, string originalFileName, string newPath, string newFileName, int maximumWidth, int maximumHeight, bool enforceRatio, bool addPadding)
        {
            var image = Image.FromFile(originalPath + "\\" + originalFileName);
            var imageEncoders = ImageCodecInfo.GetImageEncoders();
            EncoderParameters encoderParameters = new EncoderParameters(1);
            encoderParameters.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 100L);
            var canvasWidth = maximumWidth;
            var canvasHeight = maximumHeight;
            var newImageWidth = maximumWidth;
            var newImageHeight = maximumHeight;
            var xPosition = 0;
            var yPosition = 0;


            if (enforceRatio)
            {
                var ratioX = maximumWidth / (double)image.Width;
                var ratioY = maximumHeight / (double)image.Height;
                var ratio = ratioX < ratioY ? ratioX : ratioY;
                newImageHeight = (int)(image.Height * ratio);
                newImageWidth = (int)(image.Width * ratio);

                if (addPadding)
                {
                    xPosition = (int)((maximumWidth - (image.Width * ratio)) / 2);
                    yPosition = (int)((maximumHeight - (image.Height * ratio)) / 2);
                }
                else
                {
                    canvasWidth = newImageWidth;
                    canvasHeight = newImageHeight;
                }
            }

            var thumbnail = new Bitmap(canvasWidth, canvasHeight);
            var graphic = Graphics.FromImage(thumbnail);

            if (enforceRatio && addPadding)
            {
                graphic.Clear(Color.White);
            }

            graphic.InterpolationMode = InterpolationMode.HighQualityBicubic;
            graphic.SmoothingMode = SmoothingMode.HighQuality;
            graphic.PixelOffsetMode = PixelOffsetMode.HighQuality;
            graphic.CompositingQuality = CompositingQuality.HighQuality;
            graphic.DrawImage(image, xPosition, yPosition, newImageWidth, newImageHeight);

            thumbnail.Save(newPath + "\\" + newFileName, imageEncoders[1], encoderParameters);
        }
        public static Image Resize(Image image, int width, int height)
        {
            var scale = Math.Min(height / (float)image.Height, width / (float)image.Width);
            return image.GetThumbnailImage((int)(image.Width * scale), (int)(image.Height * scale), () => false, IntPtr.Zero);
        }

        public static RectangleF ScaleRect(RectangleF dest, RectangleF src,
  bool keepWidth, bool keepHeight)
        {
            RectangleF destRect = new RectangleF();

            float sourceAspect = src.Width / src.Height;
            float destAspect = dest.Width / dest.Height;

            if (sourceAspect > destAspect)
            {
                // wider than high keep the width and scale the height
                destRect.Width = dest.Width;
                destRect.Height = dest.Width / sourceAspect;

                if (keepHeight)
                {
                    float resizePerc = dest.Height / destRect.Height;
                    destRect.Width = dest.Width * resizePerc;
                    destRect.Height = dest.Height;
                }
            }
            else
            {
                // higher than wide – keep the height and scale the width
                destRect.Height = dest.Height;
                destRect.Width = dest.Height * sourceAspect;

                if (keepWidth)
                {
                    float resizePerc = dest.Width / destRect.Width;
                    destRect.Width = dest.Width;
                    destRect.Height = dest.Height * resizePerc;
                }

            }

            return destRect;
        }
        // https://stackoverflow.com/questions/1940581/c-sharp-image-resizing-to-different-size-while-preserving-aspect-ratio
        private void resizeImage(string path, string originalFilename,
                     /* note changed names */
                     int canvasWidth, int canvasHeight,
                     /* new */
                     int originalWidth, int originalHeight)
        {
            Image image = Image.FromFile(path + originalFilename);

            System.Drawing.Image thumbnail =
                new Bitmap(canvasWidth, canvasHeight); // changed parm names
            System.Drawing.Graphics graphic =
                         System.Drawing.Graphics.FromImage(thumbnail);

            graphic.InterpolationMode = InterpolationMode.HighQualityBicubic;
            graphic.SmoothingMode = SmoothingMode.HighQuality;
            graphic.PixelOffsetMode = PixelOffsetMode.HighQuality;
            graphic.CompositingQuality = CompositingQuality.HighQuality;

            /* ------------------ new code --------------- */

            // Figure out the ratio
            double ratioX = (double)canvasWidth / (double)originalWidth;
            double ratioY = (double)canvasHeight / (double)originalHeight;
            // use whichever multiplier is smaller
            double ratio = ratioX < ratioY ? ratioX : ratioY;

            // now we can get the new height and width
            int newHeight = Convert.ToInt32(originalHeight * ratio);
            int newWidth = Convert.ToInt32(originalWidth * ratio);

            // Now calculate the X,Y position of the upper-left corner 
            // (one of these will always be zero)
            int posX = Convert.ToInt32((canvasWidth - (originalWidth * ratio)) / 2);
            int posY = Convert.ToInt32((canvasHeight - (originalHeight * ratio)) / 2);

            graphic.Clear(Color.White); // white padding
            graphic.DrawImage(image, posX, posY, newWidth, newHeight);

            /* ------------- end new code ---------------- */

            System.Drawing.Imaging.ImageCodecInfo[] info =
                             ImageCodecInfo.GetImageEncoders();
            EncoderParameters encoderParameters;
            encoderParameters = new EncoderParameters(1);
            encoderParameters.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality,
                             100L);
            thumbnail.Save(path + newWidth + "." + originalFilename, info[1],
                             encoderParameters);
        }
        static System.Drawing.Image FixedSize(System.Drawing.Image imgPhoto, int Width, int Height)
        {
            int sourceWidth = imgPhoto.Width;
            int sourceHeight = imgPhoto.Height;
            int sourceX = 0;
            int sourceY = 0;
            int destX = 0;
            int destY = 0;

            float nPercent = 0;
            float nPercentW = 0;
            float nPercentH = 0;

            nPercentW = ((float)Width / (float)sourceWidth);
            nPercentH = ((float)Height / (float)sourceHeight);
            if (nPercentH < nPercentW)
            {
                nPercent = nPercentH;
                destX = System.Convert.ToInt16((Width -
                              (sourceWidth * nPercent)) / 2);
            }
            else
            {
                nPercent = nPercentW;
                destY = System.Convert.ToInt16((Height -
                              (sourceHeight * nPercent)) / 2);
            }

            int destWidth = (int)(sourceWidth * nPercent);
            int destHeight = (int)(sourceHeight * nPercent);

            Bitmap bmPhoto = new Bitmap(Width, Height,
                              System.Drawing.Imaging.PixelFormat.Format24bppRgb);
            bmPhoto.SetResolution(imgPhoto.HorizontalResolution,
                             imgPhoto.VerticalResolution);

            Graphics grPhoto = Graphics.FromImage(bmPhoto);
            grPhoto.Clear(Color.Red);
            grPhoto.InterpolationMode =
                    InterpolationMode.HighQualityBicubic;

            grPhoto.DrawImage(imgPhoto,
                new Rectangle(destX, destY, destWidth, destHeight),
                new Rectangle(sourceX, sourceY, sourceWidth, sourceHeight),
                GraphicsUnit.Pixel);

            grPhoto.Dispose();
            return bmPhoto;
        }
    }
}
