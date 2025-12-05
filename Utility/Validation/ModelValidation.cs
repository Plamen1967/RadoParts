using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Utility.Validation
{
    public class ModelValidation : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                context.Result = new BadRequestObjectResult("Something is wrong");
            }
        }

        public void OnActionExecuted(ActionExecutedContext context) { }
    }
}
