using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Rado.Datasets;
using System.Threading.Tasks;
using Rado.Models;
using Utility.Authorization;
using Rado.Authorization;
using Microsoft.AspNetCore.Http;
using Utility;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Rado.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("testingApp")]
    public class MessageController : Controller
    {
        // GET: api/<Model>
        [HttpGet]
        public IEnumerable<Model> Get()
        {
            return ModelsDbSet.GetModels();
        }

        [HttpGet]
        [Authorize]
        [Route("GetUserMessages")]
        public async Task<IEnumerable<Message>> GetUserMessages()
        {
            return await MessagesDbSet.GetUserMessagesAsync(UserId);
        }

        // GET api/<Model>/5
        [HttpGet("{id}")]
        public async Task<Model> Get(int id)
        {
            return await ModelsDbSet.GetModelByIdAsync(id);
        }

        //[HttpPost]
        //[Route("addModel")]
        //public async Task<bool> addModel([FromBody] Model value)
        //{
        //    return await ModelsDbSet.AddModelAsync(value.companyId, value.modelName);
        //}

        // POST api/<Model>
        //[HttpPost]
        //[EnableCors("testingApp")]
        //public async Task<Model> Post([FromBody] Model value)
        //{
        //    return await AdminDbSet.UpdateModel(value);
        //}
        [HttpPost]
        [AllowAnonymous]
        [EnableCors("testingApp")]
        [Route("GenerateMessage")]
        public async Task<ActionResult<string>> GenerateMessageAsync()
        {
            return await MailManager.GenerateMessageAsync();
        }


        [HttpPost]
        [AllowAnonymous]
        [EnableCors("testingApp")]
        [Route("sendEmailMessage")]
        public async Task<bool> SendEmailMessage([FromBody] EmailMessage value)
        {
            return await MessagesDbSet.SendMessageAsync(value);
        }


        // POST api/<Model>
        [HttpPost]
        [EnableCors("testingApp")]
        [Route("addMessage")]
        public bool AddMessage([FromBody] Message message)
        {
            return MessagesDbSet.AddMessage(message);
        }

        [HttpPost]
        [EnableCors("testingApp")]
        [Route("deleteMessage")]
        public bool DeleteMessage([FromBody] Id id)
        {
            return MessagesDbSet.DeleteMessage(id.id, UserId);
        }
        [HttpPost]
        [EnableCors("testingApp")]
        [Route("markRead")]
        public bool MarkRead([FromBody] Id id)
        {
            return MessagesDbSet.DeleteMessage(id.id, UserId);
        }
        // PUT api/<Model>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<Model>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
