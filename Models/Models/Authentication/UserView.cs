using Microsoft.Data.SqlClient;
using Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;


namespace Rado.Models.Authentication
{
    public class UserView
    {
        public int userId { get; set; }
        public string companyName { get; set; }
        public string firstName { get; set; }
        public string fatherName { get; set; }
        public string lastName { get; set; }
        public string phone { get; set; }
        public string phone2 { get; set; }
        public string viber { get; set; }
        public string whats { get; set; }
        public string webPage { get; set; }
        public string description { get; set; }
        public int regionId { get; set; }
        public string address { get; set; }
        public string city { get; set; }
        public ImageData busimessCard { get; set; }
        public ImageData[] images { get; set; }

    }

}
