CREATE VIEW [dbo].[ModificationView]
	AS SELECT 
        dbo.Companies.companyId, dbo.Companies.companyName, 
        dbo.GroupModel.groupModelId, dbo.GroupModel.groupModelName, 
        dbo.Models.modelName, dbo.Modifications.modificationName, dbo.Modifications.yearFrom, dbo.Modifications.yearTo, dbo.Modifications.powerHP, dbo.Modifications.kupe, dbo.Modifications.hpstring, dbo.Modifications.modificationId, dbo.Modifications.modelId
FROM  dbo.Modifications INNER JOIN
         dbo.Models ON dbo.Modifications.modelId = dbo.Models.modelId INNER JOIN
         dbo.GroupModel ON dbo.Models.groupModelId = dbo.GroupModel.groupModelId INNER JOIN
         dbo.Companies ON dbo.GroupModel.companyId = dbo.Companies.companyId
