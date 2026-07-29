using Microsoft.Data.SqlClient;
using Models.Models;
using Rado.Models.Authentication;
using System.Threading;

namespace Rado.Models
{
    public class RimView : Rim
    {
        public RimView() { }
        public string SellerName { get; set; }
        public string SellerPhone { get; set; }
        public string SellerPhone2 { get; set; }
        public string SellerViber { get; set; }
        public string SellerWhats { get; set; }
        public string SellerWebPage { get; set; }
        public int NumberImages { get; set; }
        public ImageDataClass MainImageDataClass { get; set; }

    }
}
