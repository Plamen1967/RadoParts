using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Rado.Datasets;
using Rado.Authorization;
using System.Threading.Tasks;
using Rado.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Rado.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("testingApp")]
    public class ModelController : Admin.Controller
    {
        #region Public Api
        // GET: api/<Model>
        [HttpGet]
        [AllowAnonymous]
        public async Task<Model[]> Get()
        {
            return await Rado.Datasets.ModelsDbSet.GetModelsAsync();
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("GetModelsByCompanyId")]
        public async Task<ModelMin[]> GetModelsByCompanyId([FromQuery] int companyId)
        {
            return await ModelsDbSet.GetModelsByCompanyIdAsync(companyId);
        }

        [HttpGet]
        [Authorize]
        [Route("GetModelsPerUser")]
        public async Task<ModelMin[]> GetModelsPerUser([FromQuery] int companyId)
        {
            return await Numbers.GetModelsPerUser(UserId, companyId);
        }
        // GET api/<Model>/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ModelMin> Get(int id)
        {
            return await ModelsDbSet.GetModelMinByIdAsync(id);
        }

        #endregion
    }
}
