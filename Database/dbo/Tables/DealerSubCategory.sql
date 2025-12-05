CREATE TABLE [dbo].[DealerSubCategory]
(
	[dealerSubCategoryId] INT IDENTITY (1, 1) NOT NULL PRIMARY KEY, 
    [subCategoryId] BIGINT NULL, 
    [dealerSubCategoryName] NVARCHAR(50) NULL
)
