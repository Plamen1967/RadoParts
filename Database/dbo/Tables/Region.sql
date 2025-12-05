CREATE TABLE [dbo].[Region]
(
	[regionId] INT NOT NULL IDENTITY (1, 1) PRIMARY KEY, 
    [regionName] VARCHAR(30) NOT NULL DEFAULT ''
)
