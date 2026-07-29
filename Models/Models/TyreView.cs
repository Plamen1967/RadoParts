using Models.Models;

namespace Rado.Models
{
    public class TyreView : Tyre
    {
        public string SellerName { get; set; }
        public string SellerPhone { get; set; }
        public string SellerPhone2 { get; set; }
        public string SellerViber { get; set; }
        public string SellerWhats { get; set; }
        public string SellerWebPage { get; set; }
        public int NumberImages { get; set; }
        public ImageDataClass MainImageDataClass { get; set; }

        public TraderDetails TraderDetails { get; set; }
        public TyreView()
        {

        }
    }
}