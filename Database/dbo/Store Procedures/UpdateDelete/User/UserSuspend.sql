CREATE PROCEDURE [dbo].[UserSuspend]
	@userId INT,
	@suspendedDateTime BIGINT
AS
	UPDATE 
		[User]
	SET 
		suspended = 1,
		suspendedDateTime = @suspendedDateTime
	WHERE userId = @userId

RETURN @@ROWCOUNT
