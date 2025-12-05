using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Rado.Exceptions;
using Rado.Middleware;
using Rado.Models;
using Rado.Services;
using Rado.Utility;
using Security;
using Settings;
using System.IO;
using System.Threading.Tasks;
using Utility;
using Utility.Validation;

namespace Rado
{
    public class Startup
    {
        public readonly string testingAppOrigins= "testingApp";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            Program.Configure(Configuration);
            services.AddControllersWithViews();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "part365/dist/part365/browser";
            });
            // , 
            services.AddCors(options => options.AddPolicy(
               name: testingAppOrigins,
               builder =>
               {
                   builder.WithOrigins("https://www.parts365.bg", "http://localhost:4200", "http://127.0.0.1:3000", "https://www.radoparts.com",
                       "https://www.radoparts.com", "https://test.radoparts.com", "http://localhost:4201")
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials();

               }));

            services.Configure<FormOptions>(o => {
                o.ValueLengthLimit = int.MaxValue;
                o.MultipartBodyLengthLimit = int.MaxValue;
                o.MemoryBufferThreshold = int.MaxValue;
            });

            services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));
            services.Configure<ApiBehaviorOptions>(options  => options.SuppressModelStateInvalidFilter = true);

            services.AddScoped<IJwtUtils, JwtUtils>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ModelValidation>();
            services.AddResponseCompression(options =>
            {
                options.EnableForHttps = false;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //app.UseResponseCompression();
            ProgramSettings.WebRootFolder = Program.WebRootFolder = env.WebRootPath;
            if (env.IsDevelopment())
            {
                //Program.ImageFolder = Directory.GetCurrentDirectory() + @"\dev\images";
                //Program.LogFolder = Directory.GetCurrentDirectory() + @"\dev\logs\exception";
                ProgramSettings.DevelopmentMode =  Program.DevelopmentMode = true;
                app.UseExceptionHandler("/error-development");
            }
            else
            {
                app.UseExceptionHandler("/error-development");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            ImageManager.Converter();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseCors(testingAppOrigins);
            string folder = Path.Combine(Directory.GetCurrentDirectory(), "part365", "src", @"StaticFiles");
            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            string uploadsDir = Path.Combine(env.WebRootPath, "photos");
            if (!Directory.Exists(uploadsDir))
                Directory.CreateDirectory(uploadsDir);

            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(uploadsDir),
                RequestPath = "/photos"
            });

            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }
            else
            {
                //Program.ReConfigure();
            }

            app.UseAuthentication();
            app.UseRouting();
            app.UseAuthorization();
            app.UseCors();
            app.UseMiddleware<ExceptionMiddleware>();
            app.UseMiddleware<ErrorHandlerMiddleware>();
            app.UseMiddleware<JwtMiddleware>();
            Task.Run(() => RefreshImages.Refresh(Program.ConnectionString));

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");

            });

            if (env.IsDevelopment())
            {
                Program.api = "http://localhost:4200";
            }
            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "part365/src";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
