CREATE TABLE [dbo].[Companies] (
    [companyId]   INT  NOT NULL PRIMARY KEY,
    [companyName] NVARCHAR (50) NOT NULL,
    [important]   INT NOT NULL DEFAULT 0, 
    [bus] SMALLINT NOT NULL DEFAULT 0
);

