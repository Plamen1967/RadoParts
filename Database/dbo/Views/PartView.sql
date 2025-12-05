CREATE VIEW [dbo].[PartView]
AS
SELECT dbo.Parts.partId, dbo.Parts.carId, 
        dbo.Parts.modificationId, 
        dbo.Parts.description, 
        dbo.Parts.price, 
        dbo.Parts.leftRightPosition, dbo.Parts.frontBackPosition, 
        dbo.Parts.partNumber, dbo.Parts.engineType, dbo.Parts.engineModel,
        dbo.Parts.year, dbo.Parts.powerkWh, dbo.Parts.powerBHP, 
        dbo.Parts.userId, dbo.Parts.millage, dbo.Parts.regionId, dbo.Parts.gearboxType, dbo.Parts.createdTime, 
        dbo.Parts.modifiedTime, dbo.Parts.dealerSubCategoryId, dbo.Parts.dealerSubCategoryName, 
        dbo.Parts.mainPicture, dbo.Parts.keyword, dbo.Parts.mainImageId, dbo.Parts.deleted, dbo.Parts.deleteDateTime, 
        dbo.Parts.approved, dbo.Parts.bus, dbo.[User].suspended, 
        dbo.SubcategoryView.categoryName, dbo.SubcategoryView.subCategoryName,
        dbo.SubcategoryView.categoryId AS categoryId, 
        dbo.SubcategoryView.subCategoryId as subCategoryId,
        dbo.ModificationView.companyId, dbo.ModificationView.companyName,
        dbo.ModificationView.modelId, dbo.ModificationView.modelName,
        dbo.ModificationView.groupModelId,dbo.ModificationView.groupModelName
FROM  dbo.Parts INNER JOIN
         dbo.[User] ON dbo.Parts.userId = dbo.[User].userId INNER JOIN
         dbo.ModificationView ON dbo.Parts.modificationId = dbo.ModificationView.modificationId INNER JOIN
         dbo.SubcategoryView ON dbo.Parts.dealerSubCategoryId = dbo.SubcategoryView.dealerSubCategoryId
WHERE (dbo.Parts.deleted = 0)
union
SELECT dbo.Parts.partId, dbo.Parts.carId, 
        0 AS modificationId, 
        dbo.Parts.description, 
        dbo.Parts.price, 
        dbo.Parts.leftRightPosition, dbo.Parts.frontBackPosition, 
        dbo.Parts.partNumber, dbo.Parts.engineType, dbo.Parts.engineModel,
        dbo.Parts.year, dbo.Parts.powerkWh, dbo.Parts.powerBHP, 
        dbo.Parts.userId, dbo.Parts.millage, dbo.Parts.regionId, dbo.Parts.gearboxType, dbo.Parts.createdTime, 
        dbo.Parts.modifiedTime, dbo.Parts.dealerSubCategoryId, dbo.Parts.dealerSubCategoryName, 
        dbo.Parts.mainPicture, dbo.Parts.keyword, dbo.Parts.mainImageId, dbo.Parts.deleted, dbo.Parts.deleteDateTime, 
        dbo.Parts.approved, dbo.Parts.bus, dbo.[User].suspended, 
        dbo.SubcategoryView.categoryName, dbo.SubcategoryView.subCategoryName,
        dbo.SubcategoryView.categoryId AS categoryId, 
        dbo.SubcategoryView.subCategoryId as subCategoryId,
        dbo.Models.companyId, 
        dbo.Companies.companyName,
        dbo.Models.modelId, 
        dbo.Models.modelName,
        0 as groupModelId,
        '' as groupModelName
FROM  dbo.Parts INNER JOIN
         dbo.[User] ON dbo.Parts.userId = dbo.[User].userId INNER JOIN
         dbo.Models ON dbo.Parts.modelId = dbo.Models.modelId INNER JOIN
         dbo.Companies ON dbo.Companies.companyId = dbo.Models.companyId INNER JOIN
         dbo.SubcategoryView ON dbo.Parts.dealerSubCategoryId = dbo.SubcategoryView.dealerSubCategoryId
WHERE (dbo.Parts.deleted = 0 AND dbo.Companies.bus = 1)