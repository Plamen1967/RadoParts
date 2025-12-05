CREATE TABLE [dbo].[v1_Companies] (
    [companyId]   INT           IDENTITY (1, 1) NOT NULL PRIMARY KEY,
    [companyName] NVARCHAR (50) NOT NULL,
    [important]   INT NOT NULL DEFAULT 0
);

