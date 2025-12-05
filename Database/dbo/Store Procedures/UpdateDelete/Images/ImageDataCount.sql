CREATE PROCEDURE [dbo].[ImageDataCount]
	@objectId BIGINT = 0
AS
	SELECT 
		count(*) as imageCount 
	FROM 
		ImageData 
	WHERE 
		objectId = @objectId and 
		imageType <> 2 AND
		deleted = 0

RETURN @@ROWCOUNT
