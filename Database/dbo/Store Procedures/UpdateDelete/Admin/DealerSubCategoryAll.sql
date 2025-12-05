 CREATE PROCEDURE [dbo].[DealerSubCategoryAll]
AS
	SELECT 
		*, categoryId 
	FROM 
		DealerSubCategory inner join SubCategories on DealerSubCategory.subCategoryId = SubCategories.subCategoryId
	ORDER BY 
		dealerSubCategoryName
RETURN 0
