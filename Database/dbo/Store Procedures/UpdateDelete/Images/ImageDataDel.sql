CREATE PROCEDURE [dbo].[ImageDataDel]
	@userId int,
	@imageId int,
	@objectId BIGINT OUTPUT
AS
	SELECT @objectId = objectId FROM ImageData WHERE 
		userId = @userId AND 
		imageId = @imageId

	DELETE FROM 
		ImageData 
	WHERE 
		userId = @userId AND 
		imageId = @imageId

RETURN @@ROWCOUNT
