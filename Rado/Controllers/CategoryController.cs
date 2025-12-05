using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Rado.Authorization;
using Rado.Datasets;
using Rado.Models;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Rado.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("testingApp")]
    public class CategoryController : ControllerBase
    {
        #region Public Api
        [HttpGet]
        [AllowAnonymous]
        public async Task<Category[]> Get()
        {
            return await CategoriesDbSet.GetCategoriesAsync();
        }

        // GET api/<CategoryController>/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<Category> Get(int id)
        {
            return await CategoriesDbSet.GetCategoryByIdAsync(id);
        }

        [HttpGet()]
        [EnableCors("testingApp")]
        [Route("PartsPerCategory")]
        [AllowAnonymous]
        public async Task<NumberPartsPerCategory[]> PartsPerCategory([FromQuery] FilterNumberPartsPerCategory filterNumberPartsPerCategory)
        {
            return await PartDbSet.GetNumberPartsPerCategoryAsync(filterNumberPartsPerCategory);
        }

        #endregion

    }
}
