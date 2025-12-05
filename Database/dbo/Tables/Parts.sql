CREATE TABLE [dbo].[Parts] (
    [partId]            BIGINT         NOT NULL PRIMARY KEY,
    [carId]             BIGINT            NOT NULL,
    [modificationId]    INT NOT NULL DEFAULT 0, 
    [dealerSubCategoryId] INT NOT NULL DEFAULT 0, 
    [description]          NVARCHAR(500) NOT NULL,
    [price]             DECIMAL (18)   DEFAULT ((0)) NOT NULL,
    [leftRightPosition] INT            DEFAULT ((0)) NOT NULL,
    [frontBackPosition] INT            DEFAULT ((0)) NOT NULL,
    [partNumber]        NVARCHAR(50)     NOT NULL,
    [engineType]        INT            DEFAULT ((0)) NOT NULL,
    [engineModel]       NVARCHAR(50)     NOT NULL,
    [year]              INT            DEFAULT ((0)) NOT NULL,
    [powerkWh]          INT            DEFAULT ((0)) NOT NULL,
    [powerBHP]          INT            DEFAULT ((0)) NOT NULL, 
    [categoryId]        INT NOT NULL DEFAULT 0, 
    [userId]            INT NOT NULL DEFAULT 0, 
    [millage]            INT NOT NULL DEFAULT 0, 
    [regionId] INT NOT NULL DEFAULT 0, 
    [gearboxType] INT NOT NULL DEFAULT 0, 
    [createdTime] BIGINT NOT NULL DEFAULT 0, 
    [modifiedTime] BIGINT NOT NULL DEFAULT 0, 
    [dealerSubCategoryName] NVARCHAR(50) NOT NULL DEFAULT '', 
    [mainPicture] NVARCHAR(200) NOT NULL DEFAULT '', 
    [keyword] NVARCHAR(MAX) NOT NULL DEFAULT '', 
    [mainImageId] INT NOT NULL DEFAULT 0, 
    [deleted] INT NOT NULL DEFAULT 0, 
    [deleteDateTime] datetime NOT NULL DEFAULT 0, 
    [approved] INT NOT NULL DEFAULT 0, 
    [bus] INT NOT NULL DEFAULT 0, 
    [modelId] INT NULL
);
GO


CREATE NONCLUSTERED INDEX [modificationIdIndex] ON [dbo].[Parts]
(
	[modificationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)

GO


CREATE NONCLUSTERED INDEX [dealerSubcategoryIdndex] ON [dbo].[Parts]
(
	[dealerSubCategoryId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)

GO

CREATE NONCLUSTERED INDEX [carIdPartsIndex] ON [dbo].[Parts]
(
	[carId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)

GO

CREATE NONCLUSTERED INDEX [userIdPartsIndex] ON [dbo].[Parts]
(
	[userId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)

GO
