CREATE PROCEDURE [dbo].[UserUnlock]
	@activationCode NVARCHAR(200),
	@password NVARCHAR(200)
AS
	UPDATE 
		[User]
	SET 
		password = @password,
		blocked = 0,
		attempt = 0,
		activationCode = ''
	WHERE activationCode = @activationCode

RETURN @@ROWCOUNT
