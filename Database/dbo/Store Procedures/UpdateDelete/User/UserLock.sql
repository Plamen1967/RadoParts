CREATE PROCEDURE [dbo].[UserLock]
	@userId int = 0
AS
	UPDATE [User]
	SET
	blocked = 1
	WHERE userId = @userId

RETURN @@ROWCOUNT
