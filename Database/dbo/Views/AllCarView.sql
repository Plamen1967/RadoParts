CREATE VIEW dbo.AllCarView
AS
SELECT  dbo.Companies.companyName, 
        dbo.Models.modelName, 
        dbo.CarView.carId, 
        dbo.CarView.modelId, 
        dbo.Models.companyId, 
        dbo.CarView.regNumber
FROM  dbo.CarView INNER JOIN
         dbo.Models ON dbo.CarView.modelId = dbo.Models.modelId INNER JOIN
         dbo.Companies ON dbo.Models.companyId = dbo.Companies.companyId 

GO
