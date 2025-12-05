using Models.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.Models
{
    public class UserData
    {
        public string? companyName { get; set; }
        public string? phone { get; set; }
        public string? phone2 { get; set; }
        public string? viber { get; set; }
        public string? whats { get; set; }
        public string? email { get; set; }
        public string? address { get; set; }
        public string? city { get; set; }
        public string? webPage { get; set; }
        public string? description { get; set; }
        public string? region { get; set; }
        public ImageData[] images { get; set; }
        public ImageData? businessCard { get; set; }
        public DisplayPartView[] data { get; set; }

    }
}
