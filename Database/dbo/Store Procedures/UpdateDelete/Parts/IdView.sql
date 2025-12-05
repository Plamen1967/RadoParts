CREATE  VIEW [dbo].[IdView]
AS 
	SELECT 
		partId as Id 
	FROM 
		Parts 
	WHERE 
		deleted = 0 
	UNION 
	SELECT 
		carId as Id 
	FROM 
		Cars  
	WHERE 
		deleted = 0 
	UNION
	SELECT 
		RimWithTyreId
	FROM 
		RimWithTyre
	WHERE
		deleted = 0
GO

