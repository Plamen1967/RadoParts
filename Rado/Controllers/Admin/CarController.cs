using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Elfie.Diagnostics;
using Models.Enums;
using Models.Models;
using Rado.Authorization;
using Rado.Datasets;
using Rado.Exceptions;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Runtime.ConstrainedExecution;
using System.Threading.Tasks;
using Utility;
using Utility.Authorization;
using Utility.Validation;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Controller = Rado.Controllers.Admin.Controller;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860
namespace Rado.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("testingApp")]
    [Authorize]
    public class CarController : Controller
    {
        #region Private Api
        // POST api/<CarController>
        [HttpPost]
        [EnableCors("testingApp")]
        [ServiceFilter(typeof(ModelValidation))]
        public async Task<IActionResult> Post([FromBody] Car car)
        {
            string error = "Колата не може да бъде записана";

            ControlerAuthorization.CheckAuthorizationDealer(UserId);

            try
            {
                if (car.userId != UserId)
                {
                    throw new AppException($"UserId does not match car.userId");
                }

                DisplayPartView part = await CarsDbSet.AddCarAsync(car);
                return Ok(part);
            }
            catch (UnauthorizedAccessException exception)
            {
                LoggerUtil.LogException(exception);
                return BadRequest(new { Message = error });
            }
            catch (AppException exception)
            {
                LoggerUtil.LogException(exception);
                return BadRequest(new { Message = error});
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);
                return BadRequest(new { Message = error });
            }
        }

        [HttpPatch("{id}")]
        [EnableCors("testingApp")]
        public async Task<DisplayPartView> Patch(long id, [FromBody] Car car)
        {
            string error = "Колата не може да бъде записана";

            try
            {

                if (car.userId != UserId)
                {
                    throw new AppException($"UserId does not match car.userId");
                }

                ControlerAuthorization.CheckAuthorizationDealer(UserId);

                car.userId = UserId;
                return await CarsDbSet.UpdateCarAsync(car);
            }
            catch (UnauthorizedAccessException exception)
            {
                LoggerUtil.LogException(exception);
                throw new UnauthorizedAccessException(error);
            }
            catch (AppException exception)
            {
                LoggerUtil.LogException(exception);
                throw new BadHttpRequestException(error);
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);
                throw new BadHttpRequestException(error);
            }
        }

        [HttpPost]
        [Route("delete")]
        [EnableCors("testingApp")]
        public async Task<bool> Delete([FromBody] Id id)
        {
            string error = "Колата не може да бъде записана";

            try
            {
                ControlerAuthorization.CheckAuthorizationDealer(UserId);

                return await CarsDbSet.DeleteCarAsync(id.id, UserId);
            }
            catch (UnauthorizedAccessException exception)
            {
                LoggerUtil.LogException(exception);
                throw new UnauthorizedAccessException(error);
            }
            catch (AppException exception)
            {
                LoggerUtil.LogException(exception);
                throw new BadHttpRequestException(error);
            }
            catch (Exception exception)
            {
                LoggerUtil.LogException(exception);
                throw new BadHttpRequestException(error);
            }
        }


        [HttpGet]
        [Route("GetCarPerUser")]
        public async Task<CarView[]> GetCarPerUser([FromQuery] Filter filter)
        {
            return await CarsDbSet.GetCars(filter);
        }

        [HttpGet]
        [Route("GetCarNameId")]
        public async Task<IEnumerable<CarNameId>> GetCarNameId([FromQuery] Filter filter)
        {
            filter.userId = UserId;
            return await CarsDbSet.GetCarNameId(filter);
        }

        [HttpGet]
        [Route("GetBusNameId")]
        public async Task<IEnumerable<CarNameId>> GetBusNameId([FromQuery] Filter filter)
        {
            filter.userId = UserId;
            filter.bus = 1;
            return await CarsDbSet.GetCarNameId(filter);
        }
 
        [HttpGet]
        [Route("GetCarsByModel")]
        public async Task<IEnumerable<Car>> GetCarsByModel([FromQuery] int modelId)
        {
            Filter filter = new Filter();
            filter.userId = UserId;
            filter.modelId = modelId;
            return await CarsDbSet.GetCars(filter);
        }

        [HttpPost]
        [Route("MainPicture")]
        public async Task<bool> MainPicture([FromBody] string mainPicture, long partId)
        {
            return await PartDbSet.MainPictureAsync(partId, mainPicture, UserId);
        }

        [HttpGet]
        [Route("CheckForUniqueness")]
        public async Task<bool> CheckUniquness([FromQuery] string carName, int bus)
        {
            return await CarsDbSet.CheckForUniqueness(carName, bus, UserId);
        }


        [HttpGet]
        [EnableCors("testingApp")]
        [Route("ValidateName")]
        public async Task<bool> ValidateName([FromQuery] long carId, [FromQuery] string name)
        {
            return await CarsDbSet.ValidateNameAsync(UserId, carId, name);
        }

        // DELETE api/<CarController>/5
        #endregion

        #region Public API
        // GET api/<CarController>/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<CarView> Get(long id)
        {
            return await CarsDbSet.GetCarByIdAsync(id);
        }

        [HttpGet]
        [Route("GetCars")]
        public async Task<IEnumerable<CarView>> GetCars([FromQuery] Filter filter)
        {
            filter.userId = UserId;
            return await CarsDbSet.GetCars(filter);
        }

        #endregion
        //// PUT api/<CarController>/5
        //[HttpPost("{id}")]
        //[EnableCors("testingApp")]
        //public async Task<DisplayPartView> Post(long id, [FromBody] Car car)
        //{
        //    car.userId = UserId;
        //    return await CarsDbSet.UpdateCarAsync(car);
        //}

        //// DELETE api/<CarController>/5
        //[HttpDelete("{id}")]
        //[EnableCors("testingApp")]
        //public async Task<bool> Delete(long id)
        //{
        //    return await CarsDbSet.DeleteCarAsync(id, UserId);
        //}

    }


}
