CREATE PROCEDURE [dbo].[UserWrongLogging]
	@userId INT,
	@attempt INT OUTPUT
AS
	UPDATE 
		[User]
	SET 
		attempt = attempt + 1
	WHERE 
		userId = @userId

	SELECT @attempt = attempt FROM [user] where userId = @userId

RETURN @@ROWCOUNT
