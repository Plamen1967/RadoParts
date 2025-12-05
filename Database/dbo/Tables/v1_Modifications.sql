CREATE TABLE [dbo].[v1_Modifications]
(
	[modificationId] INT IDENTITY (1, 1) NOT NULL PRIMARY KEY, 
    [modelId] INT NOT NULL, 
    [modificationName] NVARCHAR(50) NOT NULL
)
