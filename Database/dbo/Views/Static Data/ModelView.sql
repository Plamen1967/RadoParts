CREATE VIEW [dbo].[ModelView]
AS
SELECT  dbo.Companies.companyName, 
        dbo.Models.modelName, 
        dbo.Models.modelId
FROM  dbo.Companies INNER JOIN
         dbo.Models ON dbo.Companies.companyId = dbo.Models.companyId

