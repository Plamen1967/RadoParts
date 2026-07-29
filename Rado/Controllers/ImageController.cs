#region assemblies
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
#endregion

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
        [Authorize]
        [Route($"{nameof(UploadWebImage)}")]
        public async Task<ImageDataClass> UploadWebImage([FromBody] WebCamImage webCamImage)
        {
            return await ImageManager.UploadWebCameraImageAsync(UserId, webCamImage);
        }

        [HttpPost]
        [ProducesResponseType(201)]
        [ProducesResponseType(400)]
        [Route($"{nameof(DeleteBusinessCardImage)}")]
        [Authorize]
        public string DeleteBusinessCardImage()
        {
            return ImageManager.DeleteBusinessCard(UserId);
        }

        [HttpDelete("{id:int}")]
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
        [DisableRequestSizeLimit]
        [Route($"{nameof(Upload)}")]
        [Authorize]
        public async Task<ImageDataClass[]> Upload()
        {
            return await ImageManager.UploadFiles(Request, UserId);
        }

        #endregion

        #region Public Api
        [HttpGet]
        [Route($"{nameof(GetBusinessCardImage)}")]
        [AllowAnonymous]
        public ImageDataClass GetBusinessCardImage([FromQuery] int id)
        {
            return ImageManager.GetBusinessCard(id);
        }

        [HttpPost]
        [Route($"{nameof(VerifyCatcha)}")]
        [AllowAnonymous]
        public bool VerifyCatcha([FromBody] CatchaItem catchaItem)
        {
            return ImageManager.VerifyCatcha(catchaItem);
        }

        [HttpGet]
        [Route($"{nameof(GetMainImageAsync)}")]
        [AllowAnonymous]
        public async Task<ImageDataClass> GetMainImageAsync([FromQuery] long id)
        {
            return await ImageManager.GetMainImageAsync(id);
        }

        [HttpGet]
        [Route($"{nameof(GetImages)}")]
        [AllowAnonymous]
        public async Task<IEnumerable<ImageDataClass>> GetImages([FromQuery] long id)
        {
            return await ImageManager.GetImagesAsync(id);
        }

        [HttpGet]
        [Route($"{nameof(GetMinImages)}")]
        [AllowAnonymous]
        public async Task<IEnumerable<ImageDataClass>> GetMinImages([FromQuery] long id)
        {
            return await ImageManager.GetMinImagesAsync(id);
        }


        [HttpGet]
        [Route($"{nameof(GetCatcha)}")]
        [AllowAnonymous]
        public Catcha GetCatcha()
        {
            return ImageManager.GenerateCaptchaImage();
        }

        [HttpGet]
        [Route($"{nameof(GetImageCount)}")]
        public async Task<int> GetImageCount([FromQuery] long id)
        {
            return await ImageManager.GetImageCount(id);
        }

        [HttpGet]
        [Route($"{nameof(GetMainImages)}")]
        [AllowAnonymous]
        public async Task<IEnumerable<ImageDataClass>> GetMainImages([FromQuery] string ids)
        {

            IEnumerable<ImageDataClass> images = null;
            try
            {
                if (ids == null)
                {
                    return new List<ImageDataClass>();
                }

                string[] result = ids.Split(',');
                long[] ids2 = Array.ConvertAll(result, long.Parse);

                int startTime = Environment.TickCount;

                images = await ImageManager.GetMainImages(ids2);
                await Task.Run(() => LoggerUtil.Log(
                    $"ImageController::GetMainImages: {Environment.TickCount - startTime}", Environment.TickCount));
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

//[HttpPost]
//[ProducesResponseType(201)]
//[ProducesResponseType(400)]
//[Route("deleteMinImage")]
//[Authorize]
//public async Task<bool> deleteMinImage([FromBody] int imageId)
//{
//    try
//    {
//        return await ImageManager.DeleteImageAsync(UserId, imageId); ;
//    }
//    catch (Exception exception)
//    {
//        LoggerUtil.LogException(exception);
//        return false;
//    }
//}


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
