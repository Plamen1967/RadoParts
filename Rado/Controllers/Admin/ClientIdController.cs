using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Models.Models.Authentication;
using Rado.Datasets;
using Rado.Exceptions;
using Rado.Models;
using System.Threading.Tasks;

namespace Rado.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientIdController : Controller
    {
        public static readonly object clientLock = new object();
        public static int client = 1;
        // GET: api/<AdminController>
        [AllowAnonymous]
        [EnableCors("testingApp")]
        [HttpGet]
        public int Get()
        {
            lock (clientLock)
            {
                return client++;
            }
        }

        // GET api/<AdminController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<AdminController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<AdminController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        [HttpPost]
        [EnableCors("testingApp")]
        [Route("deleteUser")]
        public bool DeleteUser()
        {
            return true;
        }

        [HttpPost]
        [EnableCors("testingApp")]
        [Route("updateCategory")]
        public Category updateCategory([FromBody] Category category)
        {
            User user = UserDbSet.GetUserById(UserId);
            if (user.isAdmin())
            {
                return AdminDbSet.UpdateCategory(category);
            }

            return null;
        }

        [HttpPost]
        [EnableCors("testingApp")]
        [Route("updateSubCategory")]
        public SubCategory updateSubCategory([FromBody] SubCategory subCategory)
        {
            User user = UserDbSet.GetUserById(UserId);
            if (user.isAdmin())
            {
                return AdminDbSet.UpdateSubCategory(subCategory);
            }

            return null;
        }

        [HttpPost]
        [EnableCors("testingApp")]
        [Route("recoverPassword")]
        public string recoverPassword(int userId)
        {
            User user = UserDbSet.GetUserById(UserId);
            if (user.isAdmin())
            {
                return AdminDbSet.RecoverPassword(userId);
            }

            throw new AppException("You have to be administrator to access this functionality");
        }

        [AllowAnonymous]
        [HttpPost]
        [EnableCors("updatePassword")]
        [Route("updatePassword")]
        public bool updatePassword([FromBody] NewPassword newPassword)
        {
            User user = UserDbSet.GetUserById(UserId);
            if (user.isAdmin())
            {
                return AdminDbSet.UpdatePassword(newPassword);
            }

            return false;
        }

        [HttpPost]
        [EnableCors("testingApp")]
        [Route("updateDealerSubCategory")]
        public DealerSubCategory updateDealerSubCategory([FromBody] DealerSubCategory dealerSubCategory)
        {
            User user = UserDbSet.GetUserById(UserId);
            if (user.isAdmin())
            {
                return AdminDbSet.UpdateDealerSubCategory(dealerSubCategory);
            }

            return null;
        }

        [HttpPost]
        [EnableCors("testingApp")]
        [Route("updateCompany")]
        public async Task<Company> updateCompany([FromBody] Company company)
        {
            User user = UserDbSet.GetUserById(UserId);
            if (user.isAdmin())
            {
                return await AdminDbSet.UpdateCompany(company);
            }

            return null;
        }

        //[HttpPost]
        //[EnableCors("testingApp")]
        //[Route("updateModel")]
        //public async Task<Model> updateModel([FromBody] Model model)
        //{
        //    User user = UserDbSet.GetUserById(UserId);
        //    if (user.isAdmin())
        //    {
        //        return await AdminDbSet.UpdateModel(model);
        //    }

        //    return null;
        //}

        [HttpPost]
        [EnableCors("testingApp")]
        [Route("updateModification")]
        public async Task<Modification> updateModification([FromBody] Modification modification)
        {
            User user = UserDbSet.GetUserById(UserId);
            if (user.isAdmin())
            {
                return await AdminDbSet.UpdateModificationAsync(modification);
            }

            return null;
        }

        [HttpPost]
        [EnableCors("testingApp")]
        [Route("addCompany")]
        public async Task<Company> addCompany([FromBody] Company company)
        {
            User user = UserDbSet.GetUserById(UserId);
            if (user.isAdmin())
            {
                return await AdminDbSet.UpdateCompany(company);
            }

            return null;
        }

        //[HttpPost]
        //[EnableCors("testingApp")]
        //[Route("addModel")]
        //public async Task<Model> addModel([FromBody] Model model)
        //{
        //    User user = UserDbSet.GetUserById(UserId);

        //    if (user.isAdmin())
        //    {
        //        return await AdminDbSet.UpdateModel(model);
        //    }

        //    return null;
        //}

        [HttpPost]
        [EnableCors("testingApp")]
        [Route("addModification")]
        public async Task<Modification> addModification([FromBody] Modification modification)
        {
            User user = UserDbSet.GetUserById(UserId);
            if (user.isAdmin())
            {
                return await AdminDbSet.UpdateModificationAsync(modification);
            }

            return null;

        }

        [HttpPost]
        [EnableCors("testingApp")]
        [Route("deleteModel")]
        public bool deleteModel([FromBody] int modelId)
        {
            User user = UserDbSet.GetUserById(UserId);
            if (user.isAdmin())
            {
                return AdminDbSet.DeleteModel(modelId);
            }

            return false;

        }

        [HttpPost]
        [EnableCors("testingApp")]
        [Route("deleteModification")]
        public bool deleteModification([FromBody] int modificationId)
        {
            User user = UserDbSet.GetUserById(UserId);
            if (user.isAdmin())
            {
                return AdminDbSet.DeleteModification(modificationId);
            }

            return false;

        }

        [HttpPost]
        [EnableCors("testingApp")]
        [Route("deleteCategory")]
        public bool deleteCategory([FromBody] int subCategoryId)
        {
            User user = UserDbSet.GetUserById(UserId);
            if (user.isAdmin())
            {
                return AdminDbSet.DeleteCategory(subCategoryId);
            }

            return false;

        }

        [HttpPost]
        [EnableCors("testingApp")]
        [Route("deleteSubCategory")]
        public bool deleteSubCategory([FromBody] int subCategoryId)
        {
            User user = UserDbSet.GetUserById(UserId);
            if (user.isAdmin())
            {
                return AdminDbSet.DeleteSubCategory(subCategoryId);
            }

            return false;

        }

        [HttpPost]
        [EnableCors("testingApp")]
        [Route("deleteDealerSubCategory")]
        public bool deleteDealerSubCategory([FromBody] int dealerSubCategoryId)
        {
            User user = UserDbSet.GetUserById(UserId);
            if (user.isAdmin())
            {
                return AdminDbSet.DeleteDealerSubCategory(dealerSubCategoryId);
            }

            return false;

        }

        // DELETE api/<AdminController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
