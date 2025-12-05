CREATE PROCEDURE [dbo].[ModificationAll]
AS
	SELECT 
		* 
	FROM 
		Modifications 
	ORDER BY 
		modificationName

RETURN 0
