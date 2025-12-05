CREATE PROCEDURE [dbo].[ImageDataById]
	@imageId BIGINT
AS
	SELECT 
	    *
    FROM 
        ImageData
    WHERE
        imageId = @imageId AND  
        deleted = 0
RETURN @@ROWCOUNT
