CREATE PROCEDURE [dbo].[UserUpdateBusinessCard]
	@userId int,
	@imageId int
AS
	UPDATE 
		[User] 
	SET 
		imageId = @imageId
	WHERE userId = @userId

RETURN @@ROWCOUNT
