CREATE PROCEDURE [dbo].[PasswordUpd]
(	@userId int,
	@password NVARCHAR (255)
	)
AS
	UPDATE [User] SET [password] = @password 
	WHERE userId = @userId

RETURN @@ROWCOUNT
