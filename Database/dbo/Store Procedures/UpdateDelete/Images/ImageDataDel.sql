CREATE PROCEDURE [dbo].[ImageDataDel]
	@userId int,
    @deleteImageId int,
    @mainImageId int,
    @objectId BIGINT
AS
	DELETE FROM 
		ImageData 
	WHERE 
		userId = @userId AND 
		imageId = @deleteImageId

	update Cars set mainImageId = @mainImageId
	where carId = @objectId and userId = @userId AND @mainImageId = @deleteImageId 

	update Parts set mainImageId = @mainImageId
	where partId = @objectId and userId = @userId AND @mainImageId = @deleteImageId

	update RimWithTyre set mainImageId = @mainImageId
	where rimWithTyreId = @objectId and userId = @userId AND @mainImageId = @deleteImageId

    RETURN @@ROWCOUNT
