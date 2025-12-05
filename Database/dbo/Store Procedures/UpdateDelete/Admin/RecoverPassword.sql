CREATE PROCEDURE [dbo].[RecoverPassword]
	@userId int,
	@activationCode VARCHAR(40)
AS
	UPDATE 
		dbo.[User] 
	SET 
		activationCode = @activationCode
	WHERE 
		userId = @userId 

RETURN @@ROWCOUNT
