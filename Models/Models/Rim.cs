using Microsoft.Data.SqlClient;
using Rado.Models;

namespace Rado.Models
{
    public class Rim: Item
    {
        public Rim() { }
        public long rimId { get; set; }
        public int companyId { get; set; }
        public int modelId { get; set; }
        public int rimWidth { get; set; }
        public int rimMaterial { get; set; }
        public int rimOffset { get; set; }
        public int rimBoltCount { get; set; }
        public int rimBoltDistance { get; set; }
        public int rimCenter { get; set; }
        public int count { get; set; }
        public decimal price { get; set; }
    }
}
