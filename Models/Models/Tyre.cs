using Microsoft.Data.SqlClient;
using Rado.Models;

namespace Models.Models
{
    public class Tyre : Item
    {
        protected List<ImageDataClass> images_ = new List<ImageDataClass>();
        public long TyreId { get; set; }
        public int? TyreCompanyId { get; set; }
        public int TyreWidth { get; set; }
        public int TyreHeight { get; set; }
        public int TyreRadius { get; set; }
        public int TyreType { get; set; }
        public int Count { get; set; }
        public int? Month { get; set; }
        public int? Year { get; set; }
        public decimal Price { get; set; }
        public Tyre() { }
    }
}
