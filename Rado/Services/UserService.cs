using Microsoft.Extensions.Options;
using Models.Models.Authentication;
using Rado.Datasets;
using Rado.Exceptions;
using Rado.Models;
using Rado.Models.Authentication;
using Security;
using System;
using System.Collections.Generic;
using System.Linq;
using Utility;
using BCryptNet = BCrypt.Net.BCrypt;

namespace Rado.Services
{
    public interface IUserService
    {
        AuthenticatedUser Authenticate(AuthenticateRequest request);
        User GetById(int userId);
    }
    public class UserService : IUserService
    {
        
        private readonly AppSettings _appSetting;
        private readonly IJwtUtils _jwtUtils;
        public UserService(IJwtUtils jwtUtils, IOptions<AppSettings> appSettings)
        {
            _appSetting = appSettings.Value;
            _jwtUtils = jwtUtils;
        }
        public AuthenticatedUser Authenticate(AuthenticateRequest request)
        {
            try
            {
                var user = UserDbSet.GetUsers().FirstOrDefault(x => x.UserName == request.Username || x.Email == request.Username || x.Phone == request.Username);

                if (user == null)
                {
                    throw new AppException("Името или паролата са некоректни");
                } 
                else if (!BCryptNet.Verify(request.Password, user.PasswordHash))
                {
                    if (UserDbSet.WrongAttempt(user.UserId) == -1)
                        throw new AppException("Вашият акаунт е блокиран");
                    else
                        throw new AppException("Името или паролата са некоректни");
                }
                else if (user.Activated == 0)
                {
                    throw new AppException("Вашият акаунт не е активиран. Проверете е-майла си за активиращият код!");
                }
                else
                {
                    UserDbSet.SuccessfullLogin(user.UserId);
                }

                var jwtToken = _jwtUtils.GenerateJwtToken(user);

                return new AuthenticatedUser(user, jwtToken);
            }
            catch(Exception exception)
            {
                LoggerUtil.Log(exception);

                throw new AppException(exception.Message);
            }
        }

        //public async bool ValidateToken(string jwt, int userId)
        //{

        //}
        public User GetById(int userId)
        {
            User user;
            try
            {
                user = UserDbSet.GetUsers().First(x => x.UserId == userId);
            }
            catch(Exception exception)
            {
                LoggerUtil.Log(exception);

                throw new KeyNotFoundException("User is not found");
            }
            return user;
        }
    }
}
