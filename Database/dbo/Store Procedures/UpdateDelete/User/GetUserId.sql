CREATE PROCEDURE [dbo].[GetUserId]
	@id BIGINT
AS
	SELECT 
		userId 
	FROM 
		Parts 
	WHERE 
		partId = @id AND 
		deleted = 0
	UNION 
	SELECT 
		userId 
	FROM 
		Cars 
	WHERE 
		carId = @id AND 
		deleted = 0
RETURN @@ROWCOUNT
