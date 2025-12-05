using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Rado.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Rado.Controllers.Admin
{
    public class Controller : ControllerBase
    {
        public int UserId {
            get {
                int userId;
                if (HttpContext.Items["userId"] != null && int.TryParse(HttpContext.Items["userId"].ToString(), out userId))
                    return userId;
                else
                    return 0;

            }

        }
        public int CLientId {
            get {
                int clientId;
                if (HttpContext.Items["clientId"] != null && int.TryParse(HttpContext.Items["clientId"].ToString(), out clientId))
                    return clientId;
                else
                    return 0;

            }

        }

        public IRequestCookieCollection Cookies {
            get {
                return HttpContext.Request.Cookies;
            }

        }
    }
}
