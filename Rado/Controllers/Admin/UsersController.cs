using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Models.Models;
using Models.Models.Authentication;
using Rado.Authorization;
using Rado.Datasets;
using Rado.Enums;
using Rado.Exceptions;
using Rado.Models;
using Rado.Models.Authentication;
using Rado.Services;
using Security;
using System;
using System.ComponentModel;
using System.Threading.Tasks;
using Utility;


// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Rado.Controllers.Admin
{
    [Route("api/[controller]")]
    [EnableCors("testingApp")]
    [ApiController]
    public class UsersController : Controller
    {
        private readonly IUserService _userService;
        private readonly IJwtUtils _jwtUtils;
        public UsersController(IUserService userService, IJwtUtils jwtUtils)
        {
            _userService = userService;
            _jwtUtils = jwtUtils;
        }
        // GET: api/<UsersController>
        //[HttpGet]
        //public IEnumerable<User> Get()
        //{
        //    return UserDbSet.GetUsers().Where(user => !user.isAdmin());
        //}


        // GET api/<UsersController>/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        // TODO
        public User Get(int id)
        {
            return UserDbSet.GetUserById(id);
        }

        [HttpGet()]
        [AllowAnonymous]
        [Route("userData")]
        public async Task<UserData> GetUserData([FromQuery] int id)
        {
            return await UserDbSet.GetUserData(id);
        }

        // GET api/<UsersController>/5
        [HttpGet("getUserByActivationCode/{activationCode}")]
        public User Get(string activationCode)
        {
            return UserDbSet.GetUserByActivationCode(activationCode);
        }
        // GET api/<UsersController>/5
        [HttpGet("getUserByDomainName/{userDomain}")]
        public UserView GetUserByDomainName(string userDomain)
        {
            return UserDbSet.GetUserByDomainName(userDomain);
        }
        // POST api/<UsersController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        [HttpPost]
        [Route("ValidateJWT")]
        public IActionResult ValidateJWT([FromBody] string token)
        {
            return _jwtUtils.ValidateJwtTokenResult(token);
        }
        [AllowAnonymous]
        [HttpPost("autenticate")]
        [Route("autenticate")]
        public AuthenticatedUser autenticate(AuthenticateRequest value)
        {
            AuthenticatedUser user = _userService.Authenticate(value);

            if (user.activated != 1)
            {
                throw new AppException("Please activate the user");
            }
            else if (user.blocked == 1)
            {
                throw new AppException("Потребителя е временно блокиран");
            }
            return user;
        }

        [HttpGet()]
        [Route("GetUserView")]
        public ActionResult<UserView> GetUserView([FromQuery] int userId)
        {
            try
            {
                var result = UserDbSet.GetUserViewById(userId);

                if (result == null) return NotFound();

                return result;
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error retrieving data from the database");
            }
        }
        [HttpGet]
        [Route("numberOfPartsPerUser")]
        public async Task<NumberParts> numberOfPartsPerUser()
        {
            return await UserDbSet.NumberOfPartsPerUser(UserId);
        }

        [HttpPost]
        [Route("token")]
        public IActionResult token()
        {
            if (UserId == 0)
                return Ok(false);
            else
                return Ok(true);

        }

        [HttpPost]
        [Route("updatePassword")]
        [EnableCors("testingApp")]
        public IActionResult updatePassword(Password value)
        {
            var response = UserDbSet.UpdatePassword(value, UserId);
            return Ok(response);
        }

        [HttpGet]
        [Route("getNewUserId")]
        [EnableCors("testingApp")]
        public IActionResult getNewUserId()
        {
            // var response = UserDbSet.GetNewUserId();
            return Ok(0);
        }


        [HttpPost]
        [EnableCors("testingApp")]
        [Route("updateUser")]
        public IActionResult updateUser(User value)
        {
            if (UserId != 0)
                value.userId = UserId;
            var response = UserDbSet.UpdateUser(value, InsertUpdate.Update);
            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("sendRequest")]
        [EnableCors("testingApp")]
        public IActionResult sendRequest(RequestForInfo request)
        {
            try
            {
                User user = UserDbSet.GetUserById(request.userId);
                string email = user.email;
                email = "plamen1967@gmail.com";
                string partType = "partId";
                if (request.isCar)
                    partType = "carId";
                string link = $"<a href='{Program.api}/part?{partType} = 1669161703028' target= '_blank'>Виж часта<a>";
                string message = "Имате запитване за част:" + link;
                message += $"от {request.name}";
                message += $"<p>Съобшение {request.request}</p>";
                message += $"<a href='mailto: {request.email}>Отговори</a>";


                MailManager.SendRequestForInfo(email, "Запитване за част", message);
            }
            catch (Exception exception)
            {
                LoggerUtil.LogFunctionInfo("sendRequest");
                LoggerUtil.LogException(exception.Message);
                return Ok(false);
            }
            return Ok(true);
        }

        [HttpPost]
        [Route("userPrivate")]
        [EnableCors("testingApp")]
        public Task<string> userPrivate()
        {
            var response = UserDbSet.UserPrivateAsync(UserId);
            return response;
        }


        [HttpPost]
        [Route("userDealer")]
        [EnableCors("testingApp")]
        public string userDealer()
        {
            var response = UserDbSet.UserDealer(UserId);
            return response;
        }

        [HttpPost]
        [Route("adminActivateUser/{userId}")]
        [EnableCors("testingApp")]
        public BackendMessage adminActivateUser(int userId)
        {
            var response = UserDbSet.AdminActivateUser(userId, UserId);
            return response;
        }

        [HttpPost]
        [Route("adminUnLockUser/{userId}")]
        [EnableCors("testingApp")]
        public BackendMessage adminUnLockUser(int userId)
        {
            var response = UserDbSet.AdminUnLockUser(userId, UserId);
            return response;
        }

        [HttpPost]
        [Route("adminDeleteUser/{userId}")]
        [EnableCors("testingApp")]
        public string adminDeleteUser(int userId)
        {
            var response = UserDbSet.AdminDeleteUser(userId, UserId);
            return response;
        }

        [HttpPost]
        [Route("registerUser")]
        [EnableCors("testingApp")]
        public BackendMessage registerUser(RegisterUser value)
        {
            var response = UserDbSet.RegisterUser(value);
            return response;
        }

        [HttpPost]
        [Route("activateUser")]
        [EnableCors("testingApp")]
        public string activateUser(ActivationCode activationCode)
        {
            var response = UserDbSet.ActivateUser(activationCode.activationCode);
            return response;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("unLockUser")]
        [EnableCors("testingApp")]
        public string unLockUser(ActivationCode activationCode)
        {
            return UserDbSet.UnLockUser(activationCode);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("recoverUser/{account}")]
        [EnableCors("testingApp")]
        public BackendMessage recoverUser(string account)
        {
            return UserDbSet.RecoverUser(account);
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("getAccountByActivationCode")]
        [EnableCors("testingApp")]
        public User GetAccountByActivationCode(ActivationCode activationCode)
        {
            return UserDbSet.GetAccountByActivationCode(activationCode.activationCode);
        }

        [HttpGet]
        [Route("GetUserCount")]
        [EnableCors("testingApp")]
        public async Task<UserCount> GetUserCount()
        {
            return await UserDbSet.GetUserCountAsync(UserId);
        }

        [HttpPost]
        [Route("deleteUser")]
        [EnableCors("testingApp")]
        public string deleteUser(Id userId)
        {
            var response = UserDbSet.DeleteUser(UserId, (int)userId.id);
            return response;
        }
        // PUT api/<UsersController>/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] User value)
        {
            var response = UserDbSet.UpdateUser(value, InsertUpdate.Update);
            return Ok(response);
        }

        // DELETE api/<UsersController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}


