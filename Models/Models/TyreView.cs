using Models.Models;

namespace Rado.Models
{
    public class TyreView : Tyre
    {
        public string sellerName { get; set; }
        public string sellerPhone { get; set; }
        public string sellerPhone2 { get; set; }
        public string sellerViber { get; set; }
        public string sellerWhats { get; set; }
        public string sellerWebPage { get; set; }
        public int numberImages { get; set; }
        public ImageData mainImageData { get; set; }

        public TraderDetails traderDetails { get; set; }
        public TyreView()
        {

        }
    }
}