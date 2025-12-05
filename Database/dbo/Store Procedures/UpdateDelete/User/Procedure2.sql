CREATE PROCEDURE [dbo].[UserBlock]
	@activationCode NVARCHAR(200)
AS
	UPDATE 
		[User]
	SET 
		blocked = 0,
		attempt = 0
	WHERE activationCode = @activationCode

RETURN @@ROWCOUNT
