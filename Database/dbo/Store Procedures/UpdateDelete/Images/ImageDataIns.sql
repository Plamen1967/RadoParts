CREATE PROCEDURE [dbo].[ImageDataIns]
	@userId int,
	@objectId BIGINT,
	@imageFile varchar(200),
	@originalImageId INT,
	@imageData image,
	@imageType int,
	@imageId INT OUTPUT

AS
	INSERT 
		INTO ImageData 
	(
		userId, 
		objectId, 
		imageFile, 
		originalImageId,
		imageData,
		imageType
	) 
	VALUES 
	(
		@userId, 
		@objectId, 
		@imageFile, 
		@originalImageId,
		@imageData,
		@imageType
	)
	SET @imageId=SCOPE_IDENTITY()

RETURN @@ROWCOUNT
