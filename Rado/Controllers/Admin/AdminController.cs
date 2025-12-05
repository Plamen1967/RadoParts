using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Models.Models.Authentication;
using Rado.Authorization;
using Rado.Datasets;
using Rado.Exceptions;
using Rado.Helper;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Rado.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("testingApp")]
    [Authorize]
    public class AdminController : Controller
    {

        [HttpPost]
        public async Task<Modification> Post([FromBody] Modification modification)
        {
            return await AdminDbSet.UpdateModificationAsync(modification);
        }

        // GET: api/<AdminController>
        [HttpGet]
        [AllowAnonymous]
        public string Get()
        {
            return Program.CompanyName;
        }

        [HttpGet]
        [EnableCors("testingApp")]
        [Route("users")]
        public IActionResult Users()
        {
            User user = UserDbSet.GetUserById(UserId);
            if (user.isAdmin())
            {
                return  Ok(UserDbSet.GetUsers());
            }

            return Unauthorized();
        }

        // GET api/<AdminController>/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<CompanyController>
        [HttpPost]
        public async Task<Company> Post([FromBody] Company value)
        {
            return await AdminDbSet.UpdateCompany(value);
        }

        // PUT api/<CompanyController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }
        //// POST api/<Model>
        //[HttpPost]
        //[EnableCors("testingApp")]
        //public async Task<Model> Post([FromBody] Model value)
        //{
        //    return await AdminDbSet.UpdateModel(value);
        //}


        [HttpPost]
        [EnableCors("testingApp")]
        [Route("suspendUser")]
        public async Task<User> SuspendUser([FromBody] SuspendUser suspendUser)
        {
            User user = UserDbSet.GetUserById(UserId);
            if (user.isAdmin())
            {
                return await UserDbSet.SuspendUser(suspendUser.userId, suspendUser.suspendedDateTime);
            }

            throw new UnauthorizedAccessException();
        }

        [HttpPost]
        [EnableCors("testingApp")]
        [Route("unsuspendUser")]
        public async Task<User> UnSuspendUser([FromBody] SuspendUser suspendUser)
        {
            User user = UserDbSet.GetUserById(UserId);
            if (user.isAdmin())
            {
                return await UserDbSet.UnSuspendUser(suspendUser.userId);
            }

            throw new UnauthorizedAccessException();
        }



        [HttpGet]
        [Route("getUserCount")]
        public async Task<UserCount> GetUserCount([FromQuery]int id)
        {
            return await UserDbSet.GetUserCountAsync(id);
        }


        [HttpPost]
        [EnableCors("testingApp")]
        [Route("approveAd")]
        public bool approveAd([FromBody] ApproveAd approveAd)
        {
            User user = UserDbSet.GetUserById(UserId);
            if (user.isAdmin())
            {
                return AdminDbSet.ApproveAd(approveAd);
            }
            return false;
        }

        [HttpGet]
        [EnableCors("testingApp")]
        [Route("getUserStats")]
        public async Task<UserStats> getUserStats([FromQuery] long userId)
        {
            User user = UserDbSet.GetUserById(userId);
            if (user.isAdmin() || UserId == userId)
            {
                return await AdminDbSet.GetUserStats(userId);
            }
            return new UserStats();
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
