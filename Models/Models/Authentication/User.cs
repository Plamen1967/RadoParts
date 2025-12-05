using Microsoft.Data.SqlClient;
using Rado.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;


namespace Models.Models.Authentication
{
    public class User
    {
        public int userId { get; set; }
        public string? companyName { get; set; }
        public string? firstName { get; set; }
        public string? fatherName { get; set; }
        public string? lastName { get; set; }
        public string? phone { get; set; }
        public string? phone2 { get; set; }
        public string? viber { get; set; }
        public string? whats { get; set; }
        public string? email { get; set; }
        public string? address { get; set; }
        public string? city { get; set; }
        public int regionId { get; set; }
        public string? webPage { get; set; }
        [Required]
        public string userName { get; set; }
        public UserType dealer { get; set; }
        public string? password { get; set; }
        public string? activationCode { get; set; }

        public int activated { get; set; }
        public int blocked { get; set; }
        public int imageId { get; set; }
        public int suspended { get; set; }
        public long suspendedDateTime { get; set; }
        [JsonIgnore]
        public int attempt { get; set; }
        public string? description { get; set; }
        public string? creationDate { get; set; }
        public ImageData? imageData { get; set; }

        [JsonIgnore]
        public string? PasswordHash { get; set; }


        public bool isAdmin()
        {
            return dealer == UserType.Admin;
        }
    }
}
