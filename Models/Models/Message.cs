using Microsoft.Data.SqlClient;
using Rado.Models;

public class Message
{
	public Message() { }

	public long id { get; set; }
	public long sendUserId { get; set; }
	public long receiveUserId { get; set; }
	public long msgDate { get; set; }
	public string message { get; set; }
	public long previousMsgId { get; set; }
    public long originalMsgId { get; set; }
    public long partId { get; set; }
    public int isCar { get; set; }
    public int read { get; set; }
    public string partDescription { get; set; }
    public string modificationName { get; set; }
    public decimal price { get; set; }

}
