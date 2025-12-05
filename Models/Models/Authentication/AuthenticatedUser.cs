using Models.Models.Authentication;
using Rado.Enums;
using System.Text.Json.Serialization;

namespace Rado.Models.Authentication
{
    public class AuthenticatedUser
    {
        [JsonConstructor]
        public AuthenticatedUser(int userId, string userName, UserType dealer,
                                 string token, int regionId, int blocked,
                                 int suspended, int activated, LoginErrorType? error)
        {
            (this.userId, this.userName, this.dealer, this.token, this.regionId, this.blocked, this.suspended, this.activated, this.error) =
            (userId, userName, dealer, token, regionId, blocked, suspended, activated, error);
        }

        public AuthenticatedUser(User user, string token_)
        {
            userId = user.userId;
            userName = user.userName;
            dealer = user.dealer;
            token = token_;
            regionId = user.regionId;
            activated = user.activated;
            blocked = user.blocked;
            suspended = user.suspended;
        }

        public int userId { get; set; }
        public string userName { get; set; }
        public UserType dealer { get; set; }
        public string token { get; set; }
        public int regionId { get; set; }
        public int blocked { get; set; }
        public int suspended { get; set; }
        public int activated { get; set; }
        public LoginErrorType? error { get; set; }

    }

}
