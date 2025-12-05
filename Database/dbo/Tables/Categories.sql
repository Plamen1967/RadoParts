CREATE TABLE [dbo].[Categories] (
    [categoryId]   INT           IDENTITY (1, 1) NOT NULL,
    [categoryName] NVARCHAR (50) NOT NULL DEFAULT '', 
    [imageName] NVARCHAR(50) NOT NULL DEFAULT '', 
    CONSTRAINT [PK_Categories] PRIMARY KEY ([categoryId])
);

