using Microsoft.Data.SqlClient;
using Rado.Models;

namespace Rado.Models
{
    public class Rim: Item
    {
        public Rim() { }
        public long RimId { get; set; }
        public int CompanyId { get; set; }
        public int ModelId { get; set; }
        public int RimWidth { get; set; }
        public int RimMaterial { get; set; }
        public int RimOffset { get; set; }
        public int RimBoltCount { get; set; }
        public int RimBoltDistance { get; set; }
        public int RimCenter { get; set; }
        public int Count { get; set; }
        public decimal Price { get; set; }
    }
}
