CREATE PROCEDURE [dbo].[SubCategoryAll]
AS
	SELECT 
		* 
	FROM 
		SubCategories 
	ORDER BY 
		subCategoryName
RETURN 0
