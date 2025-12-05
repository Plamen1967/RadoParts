CREATE TABLE [dbo].[AuditTrail]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [userId] INT NOT NULL, 
    [typeId] INT NOT NULL, 
    [auditDate] DATETIME NOT NULL DEFAULT 0, 
    [description] NVARCHAR(50) NOT NULL DEFAULT ''
)
