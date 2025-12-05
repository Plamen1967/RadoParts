using Rado.Enums;
using System;

public class LoginMessage
{
	public LoginErrorType error { get; set; }
	public string message { get; set; }

	public LoginMessage()
	{
	}	
}
