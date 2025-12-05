using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Models.Models.Authentication;
using Rado.Exceptions;
using Rado.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Utility;

namespace Security
{
    public interface IJwtUtils
    {
        public string GenerateJwtToken(User user);
        public int? ValidateJwtToken(string token);
        public IActionResult ValidateJwtTokenResult(string token);

    }
    public class JwtUtils : IJwtUtils
    {
        private readonly AppSettings _appSetting;
        private readonly IConfiguration _config;
        

        public JwtUtils(IOptions<AppSettings> appSettings, IConfiguration config)
        {
            _appSetting = appSettings.Value;
            _config = config;
        }
        public string GenerateJwtToken(User user)
        {
            string days = _config["Days"];
            int dayToExpire = Convert.ToInt32(days);
            if (dayToExpire == 0) dayToExpire = 365;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSetting.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", user.userId.ToString()) }),
                Expires = DateTime.UtcNow.AddDays(dayToExpire),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        public int? ValidateJwtToken(string token)
        {
            if (token == null)
                return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSetting.Secret);
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = int.Parse(jwtToken.Claims.First(X509EncryptingCredentials => X509EncryptingCredentials.Type == "id").Value);

                return userId;
            }
            catch (SecurityTokenExpiredException e)
            {
                LoggerUtil.LogException(e);
                throw;
            }
            catch (Exception e)
            {
                LoggerUtil.LogException(e);
                throw;
            }

        }

        public IActionResult ValidateJwtTokenResult(string token)
        {
            try
            {
                int? userId = ValidateJwtToken(token);

                if (userId != null)
                    return new OkObjectResult(new { UserId = userId });

            }
            catch (SecurityTokenExpiredException e)
            {
                LoggerUtil.LogException(e);
                ObjectResult result = new ObjectResult(new { Message = "Token Expired" });
                result.StatusCode = 401;
                return result; 
            }
            catch (Exception e)
            {
                LoggerUtil.LogException(e);
                return new NotFoundObjectResult(new { Message = "Invalid"});
            }

            return new NotFoundResult();
        }

    }
}
