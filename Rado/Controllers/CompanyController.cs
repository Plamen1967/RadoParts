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
    public class CompanyController : Admin.Controller
    {
        #region Public Api
        // GET: api/<CompanyController>
        [HttpGet]
        [AllowAnonymous]
        public async Task<Company[]> Get()
        {
            return await CompaniesDbSet.GetCarCompanies();
        }

        [HttpGet]
        [Authorize]
        [Route("GetCompaniesByUserId")]
        public async Task<Company[]> GetCompaniesByUserId() {
            return await CompaniesDbSet.GetCompaniesByUserId(UserId);
        }

        [HttpGet]
        [Authorize]
        [Route("GetBusCompaniesByUserId")]
        public async Task<Company[]> GetBusCompaniesByUserId()
        {
            return await CompaniesDbSet.GetBusCompaniesByUserId(UserId);
        }

        [HttpGet]
        [Route("getbuscompanies")]
        [AllowAnonymous]
        public async Task<Company[]> GetBusCompanies()
        {
            return await CompaniesDbSet.GetBusCompaniesAsync();
        }

        // GET api/<CompanyController>/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<Company> Get(int id)
        {
            return await CompaniesDbSet.GetCompanyByIdAsync(id);
        }

        #endregion
    }
}
