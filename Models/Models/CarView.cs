using Models.Models;
using System.Text.Json.Serialization;

namespace Rado.Models
{
    public class CarView : Car
    {
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? CompanyName { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? ModelName { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? ModificationName { get; set; }
        public int CompanyId { get; set; }
        public int CountParts { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? SellerName { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? SellerPhone { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? SellerPhone2 { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? SellerViber { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? SellerWhats { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? SellerWebPage { get; set; }
        public int NumberImages { get; set; }
        public ImageDataClass? MainImageData { get; set; }
        public string UserCompanyName { get; set; }
        public string UserName { get; set; }
        public string Phone { get; set; }
        public string Phone2 { get; set; }
        public string Viber { get; set; }
        public string Whats { get; set; }
        public string City { get; set; }
        public string WebPage { get; set; }
        public int Dealer { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }


    }
}