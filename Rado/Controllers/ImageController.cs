using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Models.Models;
using Rado.Authorization;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Utility;
using Controller = Rado.Controllers.Admin.Controller;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Rado.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("testingApp")]
    public class ImageController : Controller
    {

        public ImageController(IWebHostEnvironment hostingEnvironment)
        {
        }

        #region Private Api
        [HttpPost]
        [Route("UploadWebImage")]
        [Authorize]
        public async Task<ImageData> UploadWebImage([FromBody] WebCamImage webCamImage)
        {
            return await ImageManager.UploadWebImageAsync(UserId, webCamImage);
        }

        [HttpPost]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        [Route("deleteBusinessCardImage")]
        [Authorize]
        public string DeleteBusinessCardImage()
        {
            return ImageManager.DeleteBusinessCard(UserId);
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        [Authorize]
        public async Task<bool> DeleteImage(int id)
        {
            try
            {
                return await ImageManager.DeleteImageAsync(UserId, id); 
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);
                return false;
            }
        }

        [HttpPost]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        [Route("deleteMinImage")]
        [Authorize]
        public async Task<bool> deleteMinImage([FromBody] int imageId)
        {
            try
            {
                return await ImageManager.DeleteImageAsync(UserId, imageId); ;
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException (exception);
                return false;
            }
        }

        [HttpPost]
        [DisableRequestSizeLimit]
        [Route("Upload")]
        [Authorize]
        public async Task<ImageData[]> Upload()
        {
            return await ImageManager.UploadFiles(Request, UserId);
        }

        #endregion

        #region Public Api
        [HttpGet]
        [Route("GetBusinessCardImage")]
        [AllowAnonymous]
        public ImageData GetBusinessCardImage([FromQuery] int id)
        {
            return ImageManager.GetBusinessCard(id);
        }

        [HttpPost]
        [Route("VerifyCatcha")]
        [AllowAnonymous]
        public bool VerifyCatcha([FromBody] CatchaItem catchaItem)
        {
            return ImageManager.VerifyCatcha(catchaItem);
        }

        [HttpGet]
        [Route("GetMainImageAsync")]
        [AllowAnonymous]
        public async Task<ImageData> GetMainImage([FromQuery] long id)
        {
            return await ImageManager.GetMainImageAsync(id);
        }

        [HttpGet]
        [Route("GetImages")]
        [AllowAnonymous]
        public async Task<IEnumerable<ImageData>> GetImages([FromQuery] long id)
        {
            return await ImageManager.GetImagesAsync(id);
        }

        [HttpGet]
        [Route("GetMinImages")]
        [AllowAnonymous]
        public async Task<IEnumerable<ImageData>> GetMinImages([FromQuery] long id)
        {
            return await ImageManager.GetMinImagesAsync(id);
        }


        [HttpGet]
        [Route("GetCatcha")]
        [AllowAnonymous]
        public Catcha GetCatcha()
        {
            return ImageManager.GenerateCaptchaImage();
        }

        [HttpGet]
        [Route("GetImageCount")]
        public async Task<int> GetNumberImages([FromQuery] long id)
        {
            return await ImageManager.GetNumberImages(id);
        }

        [HttpGet]
        [Route("GetMainImages")]
        [AllowAnonymous]
        public async Task<IEnumerable<ImageData>> GetMainImages([FromQuery] string ids)
        {

            IEnumerable<ImageData> images = null;
            try
            {
                if (ids == null) return new List<ImageData>();

                string[] result = ids.Split(',');
                long[] ids2 = Array.ConvertAll(result, long.Parse);

                int startTime = Environment.TickCount;

                images = await ImageManager.GetMainImages(ids2);
                await Task.Run(() => LoggerUtil.Log(string.Format("ImageController::GetMainImages: {0}", Environment.TickCount - startTime), Environment.TickCount));
            }
            catch (Exception exception)
            {
                LoggerUtil.Log(exception);
            }
            return images;
        }

        #endregion
    }
}


#region Commented
//public async System.Threading.Tasks.Task<IActionResult> UploadAsync()
//{
//    try
//    {
//        var formCollection = await Request.ReadFormAsync();
//        var file = formCollection.Files.First();
//        var folderName = Path.Combine("Resources", "Images");
//        var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

//        if (file.Length > 0)
//        {
//            var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
//            var fullPath = Path.Combine(pathToSave, fileName);
//            var dbPath = Path.Combine(folderName, fileName);

//            using (var stream = new FileStream(fullPath, FileMode.Create))
//            {
//                file.CopyTo(stream);
//            }

//            return Ok(new { dbPath });
//        }
//        else
//        {
//            return BadRequest();
//        }
//    }
//    catch (Exception ex)
//    {
//        return StatusCode(500, $"Internal server error: {ex}");
//    }
//}
#endregion
