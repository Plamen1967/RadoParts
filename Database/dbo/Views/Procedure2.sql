CREATE VIEW dbo.SubcategoryView
AS
	SELECT *
FROM  dbo.Categories INNER JOIN
         dbo.SubCategories ON dbo.Categories.categoryid = dbo.SubCategories.categoryid INNER JOIN
         dbo.DealerSubCategory ON dbo.SubCategories.subcategoryid = dbo.DealerSubCategory.subCategoryId
GO
