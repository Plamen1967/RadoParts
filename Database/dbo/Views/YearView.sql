CREATE VIEW [dbo].[YearView]
AS
SELECT  dbo.Companies.companyName, 
        dbo.Models.modelName, 
        dbo.Years.yearName, 
        dbo.Years.yearId
FROM            dbo.Companies INNER JOIN
                         dbo.Models ON dbo.Companies.companyId = dbo.Models.companyId INNER JOIN
                         dbo.Years ON dbo.Models.modelId = dbo.Years.modelId


