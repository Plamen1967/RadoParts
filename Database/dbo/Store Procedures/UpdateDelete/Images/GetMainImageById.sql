CREATE PROCEDURE [dbo].[GetMainImageById]
	@imageId bigint
AS
	SELECT 
	    *
    FROM 
        ImageDataMin
    WHERE
        imageId = @imageId AND
        deleted = 0

RETURN @@ROWCOUNT
