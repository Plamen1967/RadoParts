CREATE TABLE [dbo].[Models] (
    [modelId]   INT  NOT NULL PRIMARY KEY,
    [companyId] INT NOT NULL DEFAULT 0, 
    [groupModelId] INT           NOT NULL,
    [modelName] NVARCHAR (50) NOT NULL,
    [yearFrom]  INT           DEFAULT ((0)) NOT NULL,
    [yearTo]    INT           DEFAULT ((0)) NOT NULL, 
);


GO

CREATE INDEX [companyIdIndex] ON [dbo].[Models] ([groupModelId])
GO

