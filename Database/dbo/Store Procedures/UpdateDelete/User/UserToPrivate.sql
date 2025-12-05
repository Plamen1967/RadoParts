CREATE PROCEDURE [dbo].[UserToPrivate]
	@userId INT
AS
	UPDATE
		[User]
	SET
		dealer = 0
	WHERE 
		userId = @userId
RETURN @@ROWCOUNT
