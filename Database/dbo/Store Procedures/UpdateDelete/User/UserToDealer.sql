CREATE PROCEDURE [dbo].[UserToDealer]
	@userId INT
AS
	UPDATE
		[User]
	SET
		dealer = 1
	WHERE 
		userId = @userId
RETURN @@ROWCOUNT
