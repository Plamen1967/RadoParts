using Rado.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Rado.Models
{
    public class RegisterUser
    {
        public UserType dealer { get; set; }
        [Required]
        public string email { get; set; }
        [Required]
        public string password { get; set; }
        [Required]
        public string phone { get; set; }
        [Required]
        public string userName { get; set; }
    }
}
