CREATE PROCEDURE [dbo].[UserRecovery]
	@userId INT,
	@activationCode NVARCHAR(200)
AS
	UPDATE
		[User]
	SET
		activationCode = @activationCode
	WHERE userId = @userId

RETURN @@ROWCOUNT
