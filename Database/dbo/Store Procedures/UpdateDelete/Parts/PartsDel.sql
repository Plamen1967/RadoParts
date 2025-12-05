CREATE PROCEDURE [dbo].[PartsDel]
	@partId BIGINT,
	@userId int
AS
-- Delete Parts
	UPDATE 
		Parts 
	SET
		deleted = 1,
		deleteDateTime = CURRENT_TIMESTAMP
	WHERE
		partId = @partId AND 
		userId = @userId

-- Delete images
	UPDATE 
		ImageData 
	SET 
		deleted = 1,
		deleteDateTime = CURRENT_TIMESTAMP
	WHERE
		objectId  = @partId AND
		userId = @userId

RETURN @@ROWCOUNT
