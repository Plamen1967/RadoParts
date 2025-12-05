using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestProject.Models
{
    internal class TestSettings
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string Host { get; set; }
        public string Token { get; set; }

        static private TestSettings? testSettings;

        public TestSettings()
        {
            Username = "rado";
            Password = "rado";
            Host = "http://localhost:29235/api";
            Email = String.Empty;
            Token = String.Empty;
        }

        public static TestSettings Instance
        {
            get
            {
                if (testSettings == null)
                {
                    testSettings = new TestSettings();
                }
                return testSettings;
            }
        }
    }
}
