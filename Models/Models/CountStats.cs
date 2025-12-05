using System.Collections.Generic;

namespace Rado.Models
{
    public class CountStats
    {
        public Dictionary<int, int> companyNumber = new();
        public Dictionary<int, int> modelNumber = new();
        public Dictionary<long, int> groupModelNumber = new();
        public Dictionary<int, int> modificationNumber = new();
        public Dictionary<long, int> userNumber = new();
    }
}
