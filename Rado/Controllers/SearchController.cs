using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Models.Enums;
using Models.Models;
using Rado.Datasets;
using Rado.Enums;
using Rado.Models;
using System.Diagnostics;
using System.Threading.Tasks;
using Controller = Rado.Controllers.Admin.Controller;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Rado.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("testingApp")]
    public class SearchController : Controller
    {
        [HttpGet]
        [Route("Search")]
        public async Task<SearchResult> Search([FromQuery] Filter filterPart)
        {
            return await SearchDbSet.Search(filterPart);
        }

        [HttpGet]
        [Route("searchForPartByNumber")]
        public async Task<SearchResult> SearchForPartByNumber([FromQuery] Filter filter)
        {
            Stopwatch stopwatch = new Stopwatch();
            stopwatch.Start();

            filter.searchBy = SearchBy.PartNumber;
            SearchResult searchResult = await SearchDbSet.SearchPartByNumber(filter);
            searchResult.filter = filter;

            stopwatch.Stop();
            searchResult.duration = stopwatch.ElapsedMilliseconds;

            return searchResult;
        }

        [HttpGet]
        [Route("GetItem")]
        public async Task<DisplayPartView> GetItemAsync([FromQuery] long id)
        {
            return await SearchDbSet.GetItemAsync(id);
        }

        [HttpGet]
        [Route("getSearchResult")]
        public async Task<SearchResult> GetSearchResult([FromQuery] long query)
        {
            return await SearchDbSet.GetSearchResult(query);
        }

        [HttpGet]
        [Route("getFilter")]
        public Task<Filter> GetFilter([FromQuery] long query)
        {
            return SearchDbSet.GetFilter(query);
        }

    }
}
