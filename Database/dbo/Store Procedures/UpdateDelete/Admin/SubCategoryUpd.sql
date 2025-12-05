CREATE PROCEDURE [dbo].[SubCategoryUpd]
	@subCategoryId int,
	@subCategoryName varchar(50)
AS
	UPDATE 
		SubCategories 
	SET 
		subCategoryName = @subCategoryName
	WHERE 
		subCategoryId = @subCategoryId

RETURN @@ROWCOUNT