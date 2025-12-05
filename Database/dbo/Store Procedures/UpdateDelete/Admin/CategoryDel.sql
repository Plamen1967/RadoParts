CREATE PROCEDURE [dbo].[CategoryDel]
	@param1 int = 0,
	@categoryId int
AS
	DELETE DealerSubCategory 
	WHERE 
		subCategoryId in (SELECT subCategoryId FROM SubCategories WHERE categoryId = @categoryId)
	
	DELETE SubCategories 
	WHERE categoryId = @categoryId

	DELETE Categories 
	WHERE categoryId = @categoryId

RETURN @@ROWCOUNT
