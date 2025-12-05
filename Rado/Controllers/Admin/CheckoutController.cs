using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Models.Enums;
using Rado.Datasets;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Rado.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("testingApp")]
    public class CheckoutController : Controller
    {
        // GET: api/<CheckoutController>
        [HttpGet]
        public IEnumerable<CheckoutItemView> Get()
        {
            return CheckoutDbSet.ListItems(UserId);
        }

        // GET api/<CheckoutController>/5
        [HttpGet("{id}")]
        public int Get(int id)
        {
            return CheckoutDbSet.ChecoutItem(UserId);
        }

        [HttpGet]
        [Route("GetCheckOutItems")]
        [EnableCors("testingApp")]
        public DisplayPartView[] GetCheckOutItems([FromQuery] long[] id)
        {
            return CheckoutDbSet.ChecoutItems(id);
        }
        // POST api/<CheckoutController>
        [HttpPost]
        public int Post([FromBody] PartView value)
        {
            value.userId = UserId;
            return CheckoutDbSet.AddItem(value);
        }

        // PUT api/<CheckoutController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<CheckoutController>/5
        [HttpDelete("{id}")]
        public int Delete(int id)
        {
            return CheckoutDbSet.DeleteItem(id, UserId);
        }
    }
}
