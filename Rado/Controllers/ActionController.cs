using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using System.Collections.Generic;
using System.Threading.Tasks;
using Utility;




// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Rado.Controllers
{
    [Route("")]
    [ApiController]
    public class ActionController : ControllerBase
    {
        // GET: api/<ActionController>
        [Route("/error-development")]
        public async Task<IActionResult> HandleErrorDevelopment(
            [FromServices] IHostEnvironment hostEnvironment)
        {
            //if (!hostEnvironment.IsDevelopment())
            //{
            //    return NotFound();
            //}

            var exceptionHandlerFeature =
                HttpContext.Features.Get<IExceptionHandlerFeature>()!;

            await LoggerUtil.Log(exceptionHandlerFeature.Error.StackTrace);
            await LoggerUtil.Log(exceptionHandlerFeature.Error.Message);
            return Problem(
                detail: exceptionHandlerFeature.Error.StackTrace,
                title: exceptionHandlerFeature.Error.Message);
        }

        [Route("/error")]
        public IActionResult HandleError() =>
            Problem();
    }
}
