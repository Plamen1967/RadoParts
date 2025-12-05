CREATE PROCEDURE [dbo].[UserLogin]
	@userId INT
AS
	UPDATE 
		[User]
	SET 
		attempt = 0
	WHERE 
		userId = @userId


RETURN @@ROWCOUNT