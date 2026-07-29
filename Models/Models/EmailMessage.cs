using Rado.Enums;
using System;

public class EmailMessage
{
	public EmailMessage()
	{
	}

	public ItemType ItemType { get; set; } 

	public string Name { get; set; }
	public long Id { get; set; }
	public string Email { get; set; }
	public string Request { get; set; }
	public bool SendCopy { get; set; }

}

