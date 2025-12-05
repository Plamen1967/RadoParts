CREATE PROCEDURE [dbo].[UserUnSuspend]
	@userId INT
AS
	UPDATE 
		[User]
	SET 
		suspended = 0,
		suspendedDateTime = 0
	WHERE userId = @userId

RETURN @@ROWCOUNT
