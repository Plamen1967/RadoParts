CREATE PROCEDURE [dbo].[CategoryUpd]
	@categoryId int,
	@categoryName varchar(50)
AS
	UPDATE 
		Categories 
	SET 
		categoryName = @categoryName
	WHERE 
		categoryId = @categoryId

RETURN @@ROWCOUNT
