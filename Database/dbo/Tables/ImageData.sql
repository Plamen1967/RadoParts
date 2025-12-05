CREATE TABLE [dbo].[ImageData]
(
	[imageId] INT identity(1,1) NOT NULL PRIMARY KEY, 
    [userId] INT NOT NULL, 
    [objectId] BIGINT NOT NULL, 
    [imageData] IMAGE NOT NULL, 
    [imageFile] NVARCHAR(200) NOT NULL DEFAULT '',
    [imageType] INT NOT NULL DEFAULT 0, 
    [originalImageId] INT NOT NULL,  
    [deleted] INT NOT NULL DEFAULT 0, 
    [deleteDateTime] datetime NOT NULL DEFAULT 0
)
