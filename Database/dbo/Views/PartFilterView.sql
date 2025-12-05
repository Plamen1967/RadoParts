CREATE VIEW [dbo].[PartFilterView]
	AS 
SELECT dbo.PartView.*
FROM  dbo.PartView INNER JOIN
dbo.Models ON dbo.PartView.modelId = dbo.Models.modelId INNER JOIN
dbo.Companies ON dbo.Models.companyId = dbo.Companies.companyId
WHERE
dbo.PartView.deleted = 0
