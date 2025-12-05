CREATE TABLE [dbo].[Modifications]
(
	[modificationId] INT  NOT NULL PRIMARY KEY, 
    [modelId] INT NOT NULL, 
    [modificationName] NVARCHAR(50) NOT NULL, 
    [yearFrom] INT NOT NULL DEFAULT 0, 
    [yearTo] INT NOT NULL DEFAULT 0, 
    [powerHP] INT NOT NULL DEFAULT 0, 
    [engine] INT NOT NULL DEFAULT 0, 
    [doors] INT NOT NULL DEFAULT 0, 
    [kupe] INT NOT NULL DEFAULT 0, 
    [hpstring] NVARCHAR(200) NULL
)
