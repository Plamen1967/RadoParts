CREATE PROCEDURE [dbo].[CategoryAll]
AS
	SELECT 
		* 
	FROM 
		Categories 
	ORDER BY 
		categoryName
RETURN 0
