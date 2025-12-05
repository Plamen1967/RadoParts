using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Rado.Authorization
{
    [AttributeUsage(AttributeTargets.Method)]
    class AllowAnonymousAttribute : Attribute
    {
    }
}
