CREATE VIEW dbo.SubcategoryView
AS
	SELECT dealerSubCategoryId, dealerSubCategoryName, 
            SubCategories.subCategoryId, subCategoryName,
            Categories.categoryId, categoryName
    FROM  dbo.Categories INNER JOIN
         dbo.SubCategories ON dbo.Categories.categoryId = dbo.SubCategories.categoryId INNER JOIN
         dbo.DealerSubCategory ON dbo.SubCategories.subCategoryId = dbo.DealerSubCategory.subCategoryId
GO
