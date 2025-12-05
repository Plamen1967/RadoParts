using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Hosting.Internal;
using Rado.Datasets;
using Settings;
using System;
using System.IO;
using System.Net.Mail;
using System.Text.Json;
using Utility;

namespace Rado
{
    public class Program
    {
        public static IWebHostEnvironment _hostingEnvironment;
        public static string ImageFolder = Directory.GetCurrentDirectory();
        public static string WebRootFolder;
        public static string PictureHref { get; private set; }

        public static string LogFolder = Directory.GetCurrentDirectory() + @"\exceptions";
        public static string ServerName = @"MIC12708\SQL2K19";
        public static string DatabaseName = "Database";
        public static string UserId = "sa";
        public static string Password = "Plamen1967";
        public const int DISIABLED = -1;
        public static long NUMBERIDS = 10;
        public static int VALIDDAYS = 365;
        public static bool DevelopmentMode = false;
        public static string CompanyName = "radoparts";
        public static int ReturnPartCount = 100;
        public static int MaxSize = 50000;
        public static int MaxPictures = 10;
        static public string api = "https://radoparts.com";
        public static void Main(string[] args)
        {
            ProgramSettings.LogFolder = LogFolder;
            CreateHostBuilder(args).Build().Run();
        }

        static public void ReConfigure()
        {
            api = "http://localhost:4200";
            ServerName = "MIC12708\\SQL2K19"; ;
            DatabaseName = "db876906879";
            UserId = "sa";
            Password = "Plamen1967";
            MailManager.emailPassword = "Email_2020";
            MailManager.host = "smtp.ionos.co.uk";
            MailManager.hostEmail = "info@parts365.bg";
            MailManager.addressFrom = new MailAddress(  MailManager.hostEmail);
        }

        static public void Configure(IConfiguration configuration)
        {
            var directory = Directory.GetCurrentDirectory();
            try
            {
                string startMessage = string.Format("System Starts: {0}", DateTime.Now.ToString());
                LoggerUtil.LogInfo(startMessage);
                var text = File.ReadAllText(@"secrets.json");
                if (text != null)
                {
                    LoggerUtil.LogInfo("Open correctly");
                    LoggerUtil.LogInfo(text);
                }
                else
                {
                    LoggerUtil.LogInfo("Open not null correctly");
                }
                string address = "";
                var content = JsonSerializer.Deserialize<SecurityMetadata>(text);
                if (content != null)
                {
                    ServerName = content.ServerName;
                    DatabaseName = content.DatabaseName;
                    UserId = content.UserId;
                    Password = content.Password;
                    MailManager.host = content.Host;
                    MaxPictures = content.MaxPictures;
                    address = content.AddressFrom;
                    CompanyName = content.CompanyName;
                    ImageFolder = configuration["ImageFolder"] ?? "";
                    PictureHref = content.PictureHref ?? "";
                    MailManager.emailPassword = content.EmailPassword ?? "Email_2020";
                    MailManager.host = "smtp.ionos.co.uk";
                    MailManager.hostEmail = content.HostEmail ?? "info@parts365.bg";
                    MailManager.addressFrom = new MailAddress(MailManager.hostEmail);
                    MailManager.SendEmails = content.SendEmails;

                    MailManager.addressFrom = new MailAddress(address);
                    api = content.API;
                }

                ProgramSettings.MaxPictures = MaxPictures;
                ProgramSettings.MaxSize = MaxPictures;
                ProgramSettings.PictureHref = PictureHref;
                ProgramSettings.Api = api;
                ProgramSettings.ConnectionString = ConnectionString;
                ProgramSettings.ImageFolder = ImageFolder;
                ProgramSettings.DevelopmentMode = DevelopmentMode;
                ProgramSettings.LogFolder = LogFolder;
                ProgramSettings.WebRootFolder = WebRootFolder;

            }
            catch (Exception exception)
            {
                LoggerUtil.Log($"Connection: {ConnectionString}").Wait();
                LoggerUtil.Log(exception);
            }
            //{
            //    ServerName = "db945330347.hosting-data.io";
            //    DatabaseName = "db945330347";
            //    UserId = "dbo945330347";
            //    Password = "Detelina_1967";
            //    Mail.MailManager.host = "smtp.ionos.co.uk";
            //    Program.api = "https://www.parts365.bg";
            //    string address = "info@parts365.bg";
            //    Mail.MailManager.addressFrom = new MailAddress(address);
            //}

        }
        static public string ConnectionString
        {
            get
            {
                return $"Encrypt=false;Persist Security Info=False;server={ServerName};Initial Catalog={DatabaseName};" +
                        $"User ID={UserId};Password={Password}";
            }
        }


        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                 //.ConfigureLogging(logging => {
                 //    logging.SetMinimumLevel(LogLevel.Information);
                 //})
                 .ConfigureAppConfiguration((context, builder) =>
                 {
                     var isDev = context.HostingEnvironment.IsDevelopment();
                     var isProd = context.HostingEnvironment.IsProduction();
                     ImageFolder = context.HostingEnvironment.ContentRootPath;
                 })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
