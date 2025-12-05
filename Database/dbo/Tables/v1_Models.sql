CREATE TABLE [dbo].[v1_Models] (
    [modelId]   INT           IDENTITY (1, 1) NOT NULL,
    [companyId] INT           NOT NULL,
    [modelName] NVARCHAR (50) NOT NULL,
    [yearFrom]  INT           DEFAULT ((0)) NOT NULL,
    [yearTo]    INT           DEFAULT ((0)) NOT NULL, 
    CONSTRAINT [PK_v1_Models] PRIMARY KEY ([modelId])
);


GO

CREATE INDEX [companyIdIndex] ON [dbo].[v1_Models] ([companyId])
GO

