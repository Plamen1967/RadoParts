CREATE TABLE [dbo].[Cars] (
    [carId]       BIGINT         NOT NULL  PRIMARY KEY,
    [vin]         NVARCHAR (20)  NOT NULL,
    [regNumber]   NVARCHAR (50)  NOT NULL,
    [description] NVARCHAR (500) NOT NULL,
    [price]       DECIMAL (18)   DEFAULT ((0)) NOT NULL,
    [powerkWh]    INT            DEFAULT ((0)) NOT NULL,
    [powerBHP]    INT            DEFAULT ((0)) NOT NULL,
    [year]        INT            DEFAULT ((0)) NOT NULL,
    [modelId]     INT            DEFAULT ((0)) NOT NULL,
    [engineType]  INT            DEFAULT ((0)) NOT NULL,
    [engineModel] NVARCHAR(50)      NOT NULL, 
    [modificationId] INT NOT NULL DEFAULT ((0)), 
    [userId] INT NOT NULL DEFAULT 0, 
    [millage] INT NOT NULL DEFAULT 0, 
    [regionId] INT NOT NULL DEFAULT 0, 
    [gearboxType] INT NOT NULL DEFAULT 0, 
    [createdTime] BIGINT NOT NULL DEFAULT 0, 
    [modifiedTime] BIGINT NOT NULL DEFAULT 0, 
    [mainPicture] NVARCHAR(200) NOT NULL DEFAULT '',
    [mainImageId] INT NOT NULL DEFAULT 0, 
    [deleted] INT NOT NULL DEFAULT 0, 
    [deleteDateTime] datetime NOT NULL DEFAULT 0, 
    [approved] INT NOT NULL DEFAULT 0, 
    [bus] INT NOT NULL DEFAULT 0
);
GO

CREATE NONCLUSTERED INDEX [modificationIdIndex] ON [dbo].[Cars]
(
	[modificationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)

GO

CREATE NONCLUSTERED INDEX [modelIdIndex] ON [dbo].[Cars]
(
	[modelId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)

GO

CREATE NONCLUSTERED INDEX [userIdCarsIndex] ON [dbo].[Cars]
(
	[userId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)

GO

