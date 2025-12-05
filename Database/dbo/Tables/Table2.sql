CREATE TABLE [dbo].[Models] (
    [modelId]   INT           IDENTITY (1, 1) NOT NULL,
    [companyId] INT           NOT NULL,
    [modelName] NVARCHAR (50) NOT NULL,
    [yearFrom]  INT           DEFAULT ((0)) NOT NULL,
    [yearTo]    INT           DEFAULT ((0)) NOT NULL, 
    CONSTRAINT [PK_Models] PRIMARY KEY ([modelId])
);


GO

CREATE INDEX [companyIdIndex] ON [dbo].[Models] ([companyId])
GO

