CREATE PROCEDURE [dbo].[ImageDataAll]
	@objectId BIGINT
AS
	SELECT 
	    *
    FROM 
        ImageData
    WHERE
        objectId = @objectId and 
        imageType <> 2 AND
        deleted = 0
RETURN @@ROWCOUNT
