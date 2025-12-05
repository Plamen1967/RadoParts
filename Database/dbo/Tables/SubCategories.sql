CREATE TABLE [dbo].[SubCategories] (
    [subCategoryId]   INT            IDENTITY (1, 1) NOT NULL,
    [categoryId]      INT            NOT NULL DEFAULT 0,
    [subCategoryName] NVARCHAR (100) NOT NULL DEFAULT '', 
    CONSTRAINT [PK_SubCategories] PRIMARY KEY ([subCategoryId])
);

GO


CREATE NONCLUSTERED INDEX [categoryIdIndex] ON [dbo].[SubCategories]
(
	[categoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)

GO

