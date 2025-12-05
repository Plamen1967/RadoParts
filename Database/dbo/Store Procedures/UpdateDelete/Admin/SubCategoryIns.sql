CREATE PROCEDURE [dbo].[SubCategoryIns]
	@categoryId int,
	@subCategoryName varchar(50),
	@returnSubCategoryId int OUTPUT

AS
	INSERT INTO 
		SubCategories 
	(
		categoryId,
		subCategoryName 
	)
	VALUES
	(
		@categoryId,
		@subCategoryName
	)

	SELECT 
		@returnSubCategoryId = subCategoryId 
	FROM 
		SubCategories 
	where 
		subCategoryName = @subCategoryName and
		categoryId = @categoryId


RETURN @@ROWCOUNT