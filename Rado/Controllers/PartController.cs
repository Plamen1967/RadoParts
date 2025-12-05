using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Models.Enums;
using Models.Models;
using Rado;
using Rado.Authorization;
using Rado.Datasets;
using Rado.Enrich;
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
    [Authorize]
    public class PartController : Controller
    {
        #region Private API
        // POST api/<PartController>
        [HttpPost]
        public async Task<DisplayPartView> Post([FromBody] Part part)
        {
            try
            {
                part.userId = UserId;
                return await PartDbSet.AddPartAsync(part);
            } 
            catch(Exception exception)
            {
                LoggerUtil.LogException(exception);
                throw;
            }

        }

        // PUT api/<PartController>/5
        [HttpPatch("{id}")]
        public async Task<DisplayPartView> Patch(long id, [FromBody] Part part)
        {
            try
            {
                part.userId = UserId;
                return await PartDbSet.UpdatePartAsync(part);
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);
                throw;
            }
        }

        //[HttpDelete("{id}")]
        //[EnableCors("testingApp")]
        //public async Task<bool> Delete(long id)
        //{
        //    return await CarsDbSet.DeleteCarAsync(id, UserId);
        //}

        //// DELETE api/<PartController>/5
        //[HttpDelete("{id}")]
        //[Authorize]
        //[EnableCors("testingApp")]
        //public async Task<bool> Delete(long id)
        //{
        //    return await PartDbSet.DeletePartAsync(id, UserId);
        //    // return "Successful call of HTTP DELETE"; 
        //}

        [HttpPost]
        [Route("delete")]
        [EnableCors("testingApp")]
        public async Task<bool> Delete([FromBody] Id id)
        {
            return await PartDbSet.DeletePartAsync(id.id, UserId);
        }

        [HttpGet]
        [Route("GetPartsByCarId")]
        public async Task<IEnumerable<PartView>> GetPartsByCarId([FromQuery] long carId)
        {
            return await PartDbSet.GetPartsByCarIdAsync(carId, UserId);
        }

        [HttpGet]
        [Route("GetNextId")]
        public long GetNextId()
        {
            return PartDbSet.GetNextId();
        }

        [HttpPost]
        [Route("MainPicture")]
        public async Task<bool> MainPicture([FromBody] string mainPicture, long partId)
        {
            return await PartDbSet.MainPictureAsync(partId, mainPicture, UserId);
        }
        //[HttpPost()]
        //[Route("deletepart")]
        //public async Task<bool> deletePart([FromBody] Id id)
        //{
        //    return await PartDbSet.DeletePartAsync(id.id, UserId);
        //}
        #endregion 

        #region Public API
        [HttpGet]
        [Route("GetParts")]
        [AllowAnonymous]
        public async Task<IEnumerable<PartView>> GetParts([FromQuery] Filter filterPart)
        {
            filterPart.userId = UserId;
            filterPart.searchBy = Enums.SearchBy.Filter;
            return await PartDbSet.GetPartsAsync(filterPart);
        }
        // GET api/<PartController>/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<PartView> Get(long id)
        {
            return await PartDbSet.GetPartAsync(id);
        }

        [HttpGet()]
        [Route("GetNumberPartsPerCategory")]
        [AllowAnonymous]
        public async Task<NumberPartsPerCategory[]> GetNumberPartsPerCategory([FromQuery] FilterNumberPartsPerCategory filterNumberPartsPerCategory)
        {
            return await PartDbSet.GetNumberPartsPerCategoryAsync(filterNumberPartsPerCategory);
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("GetDisplayPartView")]
        public async Task<DisplayPartView> GetDisplayPartView([FromQuery] long id, [FromQuery] int isCar)
        {
            DisplayPartView displayPartView = null;
            try
            {
                PartView partView;
                if (isCar == 0)
                {
                    partView = await PartDbSet.GetPartAsync(id);
                }
                else
                {
                    CarView carView = await CarsDbSet.GetCarByIdAsync(id);
                    partView = new PartView();
                    EnrichManager.InitPartViewFromCar(carView, partView);

                }
                displayPartView = EnrichManager.EnrichDisplayView(partView);
            }
            catch (Exception ex)
            {
                LoggerUtil.LogException(ex.Message);
            }
            return displayPartView;
        }
        #endregion
    }
}
