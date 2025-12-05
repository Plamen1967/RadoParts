CREATE PROCEDURE [dbo].[DealerSubCategoryIns]
	@subCategoryId int,
	@dealerSubCategoryName varchar(50),
	@returnDealerSubCategoryId int OUTPUT
AS
	INSERT INTO DealerSubCategory 
	(
		subCategoryId,
		dealerSubCategoryName
	) 
	VALUES 
	(
		@subCategoryId,
		@dealerSubCategoryName
	)

	SELECT 
		@returnDealerSubCategoryId = dealerSubCategoryId 
	FROM 
		DealerSubCategory
	WHERE 
		dealerSubCategoryName = @dealerSubCategoryName and 
		subCategoryId = @subCategoryId

RETURN @@ROWCOUNT
