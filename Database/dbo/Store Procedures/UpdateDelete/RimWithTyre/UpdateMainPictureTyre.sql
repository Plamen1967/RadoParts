CREATE PROCEDURE [dbo].[UpdateMainPictureTyre]
	@rimWithTyreId BIGINT,
	@mainPicture NVARCHAR(200),
	@mainImageId INT,
	@userId INT
AS
	UPDATE 
		RimWithTyre
	SET 
		mainPicture = @mainPicture,
		mainImageId = @mainImageId

	WHERE 
		rimWithTyreId = @rimWithTyreId AND userId = @userId
RETURN 0
