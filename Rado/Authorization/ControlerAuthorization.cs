using Models.Models.Authentication;
using Rado.Datasets;
using Rado.Exceptions;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Utility.Authorization
{
    public class ControlerAuthorization
    {
        static public bool CheckAuthorizationDealer(int userId)
        {
            User user = UserDbSet.GetUserById(userId);
            if (!checkUser(user))
                return false;

            if (user.dealer == 0)
                throw new UnauthorizedAccessException("User is not a dealer");

            return true;
        }

        static private bool checkUser(User user) 
        {
            if (user == null)
            {
                throw new AppException("User can not be found");
            }

            if (user.suspended == 1)
                throw new AppException("User is suspended");

            return true;
        }
    }
}
