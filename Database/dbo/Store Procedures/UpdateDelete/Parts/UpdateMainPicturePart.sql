CREATE PROCEDURE [dbo].[UpdateMainPicturePart]
	@partId BIGINT,
	@mainPicture NVARCHAR(200),
	@mainImageId INT,
	@userId INT
AS
	UPDATE 
		Parts
	SET 
		mainPicture = @mainPicture,
		mainImageId = @mainImageId

	WHERE 
		partId = @partId AND userId = @userId

RETURN 0
