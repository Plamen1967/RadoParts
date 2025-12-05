using Microsoft.Data.SqlClient;
using Rado.Models;

namespace Models.Models
{
    public class Tyre : Item
    {
        protected List<ImageData> images_ = new List<ImageData>();
        public long tyreId { get; set; }
        public int? tyreCompanyId { get; set; }
        public int tyreWidth { get; set; }
        public int tyreHeight { get; set; }
        public int tyreRadius { get; set; }
        public int tyreType { get; set; }
        public int count { get; set; }
        public int? month { get; set; }
        public int? year { get; set; }
        public decimal price { get; set; }
        public Tyre() { }
    }
}
