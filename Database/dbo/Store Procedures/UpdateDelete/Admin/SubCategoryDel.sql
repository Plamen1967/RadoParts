CREATE PROCEDURE [dbo].[SubCategoryDel]
	@subCategoryId int
AS
	DELETE FROM 
		DealerSubCategory 
	WHERE 
		subCategoryId = @subCategoryId

	DELETE FROM 
		SubCategories 
	WHERE 
		subCategoryId = @subCategoryId

RETURN @@ROWCOUNT
