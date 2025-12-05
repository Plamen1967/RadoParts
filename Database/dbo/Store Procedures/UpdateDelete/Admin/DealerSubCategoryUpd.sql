CREATE PROCEDURE [dbo].[DealerSubCategoryUpd]
	@dealerSubCategoryId int,
	@dealerSubCategoryName varchar(50)
AS
	UPDATE 
		DealerSubCategory 
	SET 
		dealerSubCategoryName = @dealerSubCategoryName 
	WHERE 
		dealerSubCategoryId = @dealerSubCategoryId

RETURN @@ROWCOUNT
