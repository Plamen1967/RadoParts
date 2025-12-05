using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Rado.Datasets;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Rado.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("testingApp")]
    public class DealerSubCategories : ControllerBase
    {
        // GET: api/<DealerSubCategory>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<DealerSubCategory>/5
        [HttpGet("{id}")]
        public DealerSubCategory Get(int id)
        {
            return DealerSubCategoryDbSet.GetDealerSubCategoryById(id);
        }

        [HttpGet]
        [Route("GetDealerSubCategoryPerSubCategory")]
        public DealerSubCategory[] GetDealerSubCategoryPerSubCategory([FromQuery] int id)
        {
            return DealerSubCategoryDbSet.GetDealerSubCategoriesPerSubCategory(id);
        }

        [HttpGet]
        [Route("GetDealerSubCategoryPerCategory")]
        public DealerSubCategory[] GetDealerSubCategoryPerCategory([FromQuery] int id)
        {
            return DealerSubCategoryDbSet.GetDealerSubCategoriesPerCategory(id);
        }

        // POST api/<DealerSubCategory>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<DealerSubCategory>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<DealerSubCategory>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
