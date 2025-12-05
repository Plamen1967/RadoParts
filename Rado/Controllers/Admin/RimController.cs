using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Models.Enums;
using Rado.Datasets;
using Rado.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Rado.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("testingApp")]
    public class RimController : Controller
    {
        // GET: api/<PartController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<PartController>/5
        [HttpGet("{id}")]
        public RimView Get(long id)
        {
            return RimDbSet.GetRimById(id);
        }

        // POST api/<PartController>
        [HttpPost]
        public RimView Post([FromBody] Rim rim)
        {
            rim.userId = UserId;
            return RimDbSet.AddRim(rim);
        }

        // PUT api/<PartController>/5
        [HttpPost("{id}")]
        public RimView Post(long id, Rim rim)
        {
            rim.userId = UserId;
            return RimDbSet.UpdateRim(rim);
        }

        // DELETE api/<PartController>/5
        [HttpDelete("{id}")]
        public string Delete(long id)
        {
            return "Successful call of HTTP DELETE";
        }


        [HttpGet]
        [AllowAnonymous]
        [Route("GetDisplayRimView")]
        public DisplayPartView GetDisplayPartView([FromQuery] long rimId)
        {
            RimView rimView;
            rimView = RimDbSet.GetRimById(rimId);
            return null;
        }


        [HttpGet]
        [Route("GetNextId")]
        public long GetNextId()
        {
            return PartDbSet.GetNextId();
        }

        [HttpGet]
        [Route("getSearchResult")]
        public SearchResult GetSearchResult([FromQuery] long query)
        {
            return null; // RimDbSet.GetSearchResult(query);
        }

        [HttpPost]
        [Route("MainPicture")]
        public async Task<bool> MainPicture([FromBody] string mainPicture, long rimId)
        {
            return await PartDbSet.MainPictureAsync(rimId, mainPicture, UserId);
        }
        [HttpPost()]
        [Route("deleterim")]
        public bool deleteRim([FromBody] Id id)
        {
            return RimDbSet.DeleteRim(id.id, UserId);
        }

        //[HttpGet]
        //[Route("GetParts")]
        //public async Task<IEnumerable<TyreView>> GetParts([FromQuery] FilterPart filterPart)
        //{
        //    filterPart.userId = UserId;
        //    filterPart.searchBy = Enums.SearchBy.Filter;
        //    return await Task<IEnumerable<TyreView>>(null);
        //}




    }
}
