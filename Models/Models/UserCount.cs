using Models.Models.Authentication;

namespace Rado.Models
{
    public class UserCount
    {
        public User user;
        public int carCount { get; set; }
        public int busCount { get; set; }
        public int partCarCount { get; set; }
        public int partBusCount { get; set; }
        public int rimCount { get; set; }
        public int tyreCount { get; set; }
        public int rimWithTyreCount { get; set; }
    }
}
