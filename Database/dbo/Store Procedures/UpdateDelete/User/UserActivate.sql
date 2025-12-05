CREATE PROCEDURE [dbo].[UserActivate]
	@activationCode NVARCHAR(200)
AS
	UPDATE 
		[User]
	SET 
		activated = 1,
		activationCode = ''
	WHERE activationCode = @activationCode

RETURN @@ROWCOUNT
