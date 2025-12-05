CREATE VIEW [dbo].[RimWithTyreView]
	AS 
SELECT dbo.RimWithTyre.rimWithTyreId, dbo.RimWithTyre.itemType, dbo.RimWithTyre.tyreCompanyId, dbo.RimWithTyre.tyreWidth, dbo.RimWithTyre.tyreHeight, dbo.RimWithTyre.tyreRadius, dbo.RimWithTyre.tyreType, dbo.RimWithTyre.rimWidth, dbo.RimWithTyre.companyId, dbo.RimWithTyre.modelId, dbo.RimWithTyre.rimMaterial, dbo.RimWithTyre.rimOffset, dbo.RimWithTyre.rimBoltCount, dbo.RimWithTyre.rimBoltDistance, dbo.RimWithTyre.rimCenter, dbo.RimWithTyre.price, 
         dbo.RimWithTyre.description, dbo.RimWithTyre.mainImageId, dbo.RimWithTyre.mainPicture, dbo.RimWithTyre.regionId, dbo.RimWithTyre.userId, dbo.RimWithTyre.approved, dbo.RimWithTyre.createdTime, dbo.RimWithTyre.modifiedTime, dbo.RimWithTyre.deleted, dbo.RimWithTyre.count, dbo.RimWithTyre.month, dbo.RimWithTyre.year, dbo.[User].suspended, dbo.Models.groupModelId
FROM  dbo.GroupModel INNER JOIN
         dbo.Models ON dbo.GroupModel.groupModelId = dbo.Models.groupModelId RIGHT OUTER JOIN
         dbo.RimWithTyre INNER JOIN
         dbo.[User] ON dbo.RimWithTyre.userId = dbo.[User].userId ON dbo.Models.modelId = dbo.RimWithTyre.modelId
WHERE (dbo.RimWithTyre.deleted = 0)
