using Microsoft.Data.SqlClient;
using Models.Models;
using Rado.Models.Authentication;
using System.Threading;

namespace Rado.Models
{
    public class RimView : Rim
    {
        public RimView() { }
        public string sellerName { get; set; }
        public string sellerPhone { get; set; }
        public string sellerPhone2 { get; set; }
        public string sellerViber { get; set; }
        public string sellerWhats { get; set; }
        public string sellerWebPage { get; set; }
        public int numberImages { get; set; }
        public ImageData mainImageData { get; set; }

    }
}
