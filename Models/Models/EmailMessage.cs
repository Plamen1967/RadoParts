using Rado.Enums;
using System;

public class EmailMessage
{
	public EmailMessage()
	{
	}

	public ItemType itemType { get; set; } 

	public string name { get; set; }
	public long id { get; set; }
	public string email { get; set; }
	public string request { get; set; }
	public bool sendCopy { get; set; }

}

