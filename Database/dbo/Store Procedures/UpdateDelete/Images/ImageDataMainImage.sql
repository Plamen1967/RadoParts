CREATE PROCEDURE [dbo].[ImageDataMainImage]
	@objectId BIGINT
AS
    SELECT 
        * 
    FROM 
        ImageData 
    WHERE 
        imageId in 
        (
	        SELECT 
	            imageId
            FROM 
                ImageData
            WHERE
                imageId in 
                    (
                        SELECT 
                            mainImageId 
                        FROM 
                            Cars 
                        WHERE 
                            carId = @objectId AND 
                            deleted = 0
                        UNION 
                        SELECT 
                            mainImageId 
                        FROM 
                            Parts 
                        WHERE 
                            partId = @objectId  AND 
                            deleted = 0
                        UNION 
                        SELECT 
                            mainImageId 
                        FROM 
                            RimWithTyre
                        WHERE 
                            rimWithTyreId = @objectId  AND 
                            deleted = 0
                    )
     )
RETURN @@ROWCOUNT
