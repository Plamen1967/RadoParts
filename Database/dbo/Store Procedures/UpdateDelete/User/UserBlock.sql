CREATE PROCEDURE [dbo].[UserBlock]
	@userId INT
AS
	UPDATE 
		[User]
	SET 
		blocked = 1
	WHERE userId = @userId

RETURN @@ROWCOUNT
