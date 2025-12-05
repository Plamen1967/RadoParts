CREATE TABLE [dbo].[GroupModel]
(
	[groupModelId] INT NOT NULL PRIMARY KEY, 
    [groupModelName] NVARCHAR(50) NOT NULL DEFAULT '', 
    [companyId] INT NOT NULL DEFAULT 0

)
