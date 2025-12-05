using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Models.Enums;
using Models.Models.Utility;
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
    public class RimWithTyreController : Controller
    {
        #region Private Api
        // POST api/<PartController>
        [HttpPost]
        [EnableCors("testingApp")]
        public async Task<DisplayPartView> Post([FromBody] RimWithTyre rimWithTyre)
        {
            rimWithTyre.userId = UserId;
            return await RimWithTyreDbSet.AddRimWithTyreAsync(rimWithTyre);
        }

        [HttpPost()]
        [Route("MainPicture")]
        [EnableCors("testingApp")]
        public async Task<bool> MainPictureAsync([FromQuery] long id, [FromBody] string mainPicture)
        {
            return await RimWithTyreDbSet.MainPictureAsync(id, mainPicture, UserId);
        }

        // PUT api/<PartController>/5
        [HttpPost("{id}")]
        [EnableCors("testingApp")]
        public async Task<DisplayPartView> Post(long id, RimWithTyre rimWithTyre)
        {
            try
            {
                rimWithTyre.userId = UserId;
                return await RimWithTyreDbSet.AddRimWithTyreAsync(rimWithTyre);
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);
                throw;
            }
        }

        [HttpPatch("{id}")]
        public async Task<DisplayPartView> Patch(long id, [FromBody] RimWithTyre rimWithTyre)
        {
            try
            {
                rimWithTyre.userId = UserId;
                return await RimWithTyreDbSet.UpdateRimWithTyreAsync(rimWithTyre);
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);
                throw;
            }
        }

        [HttpPost()]
        [Route("delete")]
        public async Task<bool> delete([FromBody] Id id)
        {
            return await RimWithTyreDbSet.DeleteRimWithTyreAsync(id.id, UserId);
        }

        #endregion  

        #region Public Api
        [HttpGet]
        [Route("getCount")]
        [AllowAnonymous]
        public async Task<CountTyres> getCount()
        {
            return await RimWithTyreDbSet.GetCountAsync();
        }


        [HttpGet]
        [AllowAnonymous]
        [Route("GetDisplayTyreView")]
        public async Task<DisplayPartView> GetDisplayPartView([FromQuery] long rimWithTyreId)
        {
            RimWithTyreView rimWithTyre = await RimWithTyreDbSet.GetRimWithTyreByIdAsync(rimWithTyreId);

            return await Task.FromResult(EnrichManager.EnrichDisplayPartView(rimWithTyre));
        }

        // GET api/<PartController>/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<RimWithTyreView> Get(long id)
        {
            return await RimWithTyreDbSet.GetRimWithTyreByIdAsync(id);
        }

        [HttpGet]
        [Route("GetNextId")]
        [AllowAnonymous]
        public long GetNextId()
        {
            return PartDbSet.GetNextId();
        }

        #endregion
    }
}
