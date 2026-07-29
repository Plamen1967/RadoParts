using Microsoft.Data.SqlClient;
using Rado.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;


namespace Models.Models.Authentication
{
    public class User
    {
        public int UserId { get; set; }
        public string? CompanyName { get; set; }
        public string? FirstName { get; set; }
        public string? FatherName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public string? Phone2 { get; set; }
        public string? Viber { get; set; }
        public string? Whats { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public int RegionId { get; set; }
        public string? WebPage { get; set; }
        [Required]
        public string UserName { get; set; }
        public UserType Dealer { get; set; }
        public string? Password { get; set; }
        public string? ActivationCode { get; set; }

        public int Activated { get; set; }
        public int Blocked { get; set; }
        public int ImageId { get; set; }
        public int Suspended { get; set; }
        public long SuspendedDateTime { get; set; }
        [JsonIgnore]
        public int Attempt { get; set; }
        public string? Description { get; set; }
        public string? CreationDate { get; set; }
        public ImageDataClass? ImageData { get; set; }

        [JsonIgnore]
        public string? PasswordHash { get; set; }


        public bool IsAdmin()
        {
            return Dealer == UserType.Admin;
        }
        public User() { }
    }
}
