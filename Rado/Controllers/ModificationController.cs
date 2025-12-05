using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Rado.Datasets;
using Rado.Models;
using Rado.Authorization;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Rado.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("testingApp")]
    public class ModificationController : Admin.Controller
    {
        #region Public Api

        [HttpGet]
        [AllowAnonymous]
        public async Task<Modification[]> Get()
        {
            return await ModificationsDbSet.GetModificationsAsync();
        }

        [HttpGet]
        [Route("GetModificationByName")]
        public async Task<Modification> Get([FromQuery] string modification)
        {
            return await ModificationsDbSet.GetModificationByNameAsync(modification);
        }


        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ModificationMin[]> Get(int id)
        {
            return await ModificationsDbSet.GetModificationByModelIdAsync(id);
        }

        [HttpGet]
        [Route("getModifications")]
        [AllowAnonymous]
        public async Task<Models.ModificationMin[]> getModifications([FromQuery] string modelsId)
        {
            return await ModificationsDbSet.GetModificationByModelsIdAsync(modelsId);
        }

        [HttpGet]
        [Authorize]
        [Route("getModificationsByUserId")]
        [AllowAnonymous]
        public async Task<Models.ModificationMin[]> getModificationsByUserId([FromQuery] string modelsId)
        {
            return await Numbers.GetModificationsPerUserAsync(UserId, modelsId);
        }

        [HttpGet]
        [Route("getModificationsFull")]
        [AllowAnonymous]
        public async Task<Models.Modification[]> getModificationsFull([FromQuery] string modelsId)
        {
            return await ModificationsDbSet.GetModificationFullByModelsIdAsync(modelsId);
        }

        #endregion

    }
}
