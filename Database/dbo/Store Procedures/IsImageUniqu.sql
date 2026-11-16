
ALTER PROCEDURE [dbo].[IsImageUnique]
    @imageFile VARCHAR(200),
    @userId int,
    @objectId INT,
    @count_image INT OUTPUT 
AS
	SELECT @count_image = count(*) FROM ImageData WHERE userId = @userId and imageFile = @imageFile and objectId = @objectId
    RETURN @count_image