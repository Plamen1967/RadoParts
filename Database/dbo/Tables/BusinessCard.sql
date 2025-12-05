CREATE TABLE [dbo].[BusinessCard]
(
    [userId] INT NOT NULL, 
    [image] IMAGE NOT NULL, 
    [deleted] SMALLINT DEFAULT 0 NOT NULL, 
    [deleteDateTime] DATETIME NOT NULL DEFAULT 0 
)
