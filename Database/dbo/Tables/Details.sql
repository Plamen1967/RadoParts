CREATE TABLE [dbo].[Details]
(
	[Id] BIGINT NOT NULL PRIMARY KEY,
    [typeId]  INT NOT NULL DEFAULT 0,
    [price] DECIMAL NOT NULL DEFAULT 0, 
    [description] NVARCHAR(500) NOT NULL DEFAULT '', 
    [mainImageId] INT NOT NULL DEFAULT 0,
    [mainPicture] NVARCHAR(200) NOT NULL DEFAULT '', 
    [userId] INT NOT NULL DEFAULT 0, 
    [approved] INT NOT NULL DEFAULT 0, 
    [createdTime] BIGINT NOT NULL DEFAULT 0, 
    [modifiedTime] BIGINT NOT NULL DEFAULT 0,
    [deleted] INT NOT NULL DEFAULT 0
)
