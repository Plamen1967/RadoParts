CREATE PROCEDURE [dbo].[GetMainImage]
	@id bigint
AS
	SELECT 
		mainPicture 
	FROM 
		Parts 
	WHERE 
		partId = @id AND 
		deleted = 0
	UNION
	SELECT 
		mainPicture 
	FROM 
		Cars 
	WHERE 
		carId = @id AND 
		deleted = 0

RETURN @@ROWCOUNT
