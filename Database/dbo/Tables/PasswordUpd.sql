CREATE PROCEDURE [dbo].[PasswordUpd]
	@userId int,
	@password NVARCHAR (50)
AS
	UPDATE [User] SET
		@password = @password
	WHERE userId =	@userId
RETURN 0
