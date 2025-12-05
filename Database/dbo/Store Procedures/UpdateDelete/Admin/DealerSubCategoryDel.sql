CREATE PROCEDURE [dbo].[DealerSubCategoryDel]
	@dealerSubCategoryId int
AS
	DELETE FROM 
		DealerSubCategory 
	WHERE 
		dealerSubCategoryId = @dealerSubCategoryId

RETURN @@ROWCOUNT
