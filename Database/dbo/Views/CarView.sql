CREATE VIEW [dbo].[CarView]
AS
SELECT dbo.Cars.carId, 
		dbo.Cars.vin, 
		dbo.Cars.regNumber, 
		dbo.Cars.description, 
		dbo.Cars.price, 
		dbo.Cars.powerkWh, 
		dbo.Cars.powerBHP, 
		dbo.Cars.year, 
		dbo.Cars.modelId, 
		dbo.Cars.engineType, 
		dbo.Cars.engineModel, dbo.Cars.modificationId, dbo.Cars.userId, dbo.Cars.millage, dbo.Cars.regionId, dbo.Cars.gearboxType, dbo.Cars.createdTime, dbo.Cars.modifiedTime, dbo.Cars.mainPicture, dbo.Cars.mainImageId, dbo.Cars.deleted, dbo.Cars.deleteDateTime, dbo.Cars.approved, 
        dbo.Cars.bus, dbo.Companies.companyId, dbo.Companies.companyName,  dbo.Models.modelName, ISNULL(dbo.Modifications.modificationName, '') as modificationName,
		dbo.Models.groupModelId, dbo.[User].suspended,
       dbo.[User].companyName AS userCompany,
       dbo.[User].firstName,
       dbo.[User].lastName,
       dbo.[User].viber,
       dbo.[User].whats,
       dbo.[User].city,
       dbo.[User].dealer,
       dbo.[User].webPage

FROM  dbo.Cars INNER JOIN
         dbo.[User] ON dbo.Cars.userId = dbo.[User].userId INNER JOIN
         dbo.Models ON dbo.Cars.modelId = dbo.Models.modelId INNER JOIN
         dbo.Companies ON dbo.Models.companyId = dbo.Companies.companyId LEFT OUTER JOIN
         dbo.Modifications ON dbo.Cars.modificationId = dbo.Modifications.modificationId
WHERE (dbo.Cars.deleted = 0)