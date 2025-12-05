CREATE PROCEDURE [dbo].[CategoryIns]
	@categoryName varchar(50),
	@returnCategoryId int OUTPUT
AS
	INSERT INTO Categories 
	(
		categoryName
	) 
	VALUES 
	(
		@categoryName
	)

	SELECT 
		@returnCategoryId = categoryId 
	FROM 
		Categories 
	WHERE 
		categoryName = @categoryName 

RETURN @@ROWCOUNT
