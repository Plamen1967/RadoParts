using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Models.Enums;
using Models.Models;
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
    [Authorize]

    public class TyreController : Controller
    {
        // GET: api/<PartController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<PartController>/5
        [HttpGet("{id}")]
        public async Task<TyreView> Get(long id)
        {
            return await TyreDbSet.GetTyreByIdAsync(id);
        }

        // POST api/<PartController>
        [HttpPost]
        public async Task<TyreView> Post([FromBody] Tyre tyre)
        {
            tyre.userId = UserId;
            return await TyreDbSet.AddTyreAsync(tyre);
        }

        // PUT api/<PartController>/5
        [HttpPost("{id}")]
        public async Task<TyreView> Post(long id, Tyre tyre)
        {
            tyre.userId = UserId;
            return await TyreDbSet.UpdateTyreAsync(tyre);
        }

        // DELETE api/<PartController>/5
        [HttpDelete("{id}")]
        public string Delete(long id)
        {
            return "Successful call of HTTP DELETE";
        }


        [HttpGet]
        [AllowAnonymous]
        [Route("GetDisplayTyreView")]
        public DisplayPartView GetDisplayPartView([FromQuery] long tyreId)
        {
            return null;
        }


        [HttpGet]
        [Route("GetNextId")]
        [AllowAnonymous]

        public long GetNextId()
        {
            return PartDbSet.GetNextId();
        }

        [HttpGet]
        [Route("getSearchResult")]
        [AllowAnonymous]

        public async Task<SearchResult> GetSearchResult([FromQuery] long query)
        {
            return await TyreDbSet.GetSearchResult(query);
        }

        //[HttpGet]
        //[Route("GetPage")]
        //public DisplayPartView[] GetPage([FromQuery] int client, [FromQuery] int page)
        //{
        //    return PartDbSet.GetPage(client, page);
        //}

        [HttpPost]
        [Route("MainPicture")]
        public async Task<bool> MainPicture([FromBody] string mainPicture, long partId)
        {
            return await PartDbSet.MainPictureAsync(partId, mainPicture, UserId);
        }

        [HttpPost()]
        [Route("deletetyre")]
        public bool deleteTyre([FromBody] Id id)
        {
            return TyreDbSet.DeleteTyre(id.id, UserId);
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
