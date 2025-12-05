using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Rado.Authorization;
using Rado.Datasets;
using Rado.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Rado.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("testingApp")]
    public class SubCategoryController : ControllerBase
    {
        #region Public Api

        // GET: api/<SubCategoryController>
        [HttpGet]
        [AllowAnonymous]
        public async Task<IEnumerable<SubCategory>> Get()
        {
            return await SubCategoriesDbSet.GetSubCategoriesAsync();
        }

        [HttpGet]
        [Route("GetSubCategoriesByCategoryId")]
        [AllowAnonymous]
        public async Task<IEnumerable<SubCategory>> GetSubCategories([FromQuery] int categoryId)
        {
           return await SubCategoriesDbSet.GetSubCategoriesAsync(categoryId);
        }

        [HttpGet]
        [Route("GetSubCategoriesByCategoriesId")]
        [AllowAnonymous]
        public async Task<IEnumerable<SubCategory>> GetSubCategoriesByCategoriesId([FromQuery] string categoryId)
        {
            return await SubCategoriesDbSet.GetSubCategoriesByCategoriesId(categoryId);
        }
        // GET api/<SubCategoryController>/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public SubCategory Get(int id)
        {
            return SubCategoriesDbSet.GetSubCategoryById(id);
        }

        #endregion
    }
}
