CREATE PROCEDURE [dbo].[CategoryView]
	@companyId int = NULL,
	@modelId int = NULL,
	@groupModelId int = NULL,
	@model1Id int = NULL,
	@hasImages int = NULL,
	@groupModel1Id int = NULL,
	@model2Id int = NULL,
	@groupModel2Id int = NULL,
	@model3Id int = NULL,
	@groupModel3Id int = NULL,
	@model4Id int = NULL,
	@groupModel4Id int = NULL,
	@modificationId int = NULL,
	@modification1Id int = NULL,
	@modification2Id int = NULL,
	@modification3Id int = NULL,
	@modification4Id int = NULL,
	@modification5Id int = NULL,
	@userId int = NULL,
	@suspended int = NULL,
	@bus int = NULL
AS
IF  @bus != 1
	SELECT COUNT(*) AS countPart, categoryId, subCategoryId  FROM (
SELECT dbo.PartView.categoryId, subCategoryId
FROM  dbo.Models INNER JOIN
         dbo.PartView ON dbo.Models.modelId = dbo.PartView.modelId INNER JOIN
         dbo.Companies ON dbo.Models.companyId = dbo.Companies.companyId LEFT OUTER JOIN
         dbo.Modifications ON dbo.PartView.modificationId = dbo.Modifications.modificationId LEFT OUTER JOIN
         dbo.GroupModel ON dbo.Models.groupModelId = dbo.GroupModel.groupModelId
	WHERE  
		dbo.PartView.deleted = 0 AND 
		(@hasImages = 0  OR mainImageId <> 0) AND
		dbo.PartView.bus = ISNULL(@bus, dbo.PartView.bus) AND 
		dbo.PartView.suspended = ISNULL(@suspended, dbo.PartView.suspended) AND 
		dbo.PartView.userId = ISNULL(@userId, dbo.PartView.userId) AND
		dbo.Models.modelId = ISNULL(@modelId, dbo.Models.modelId) AND
		dbo.GroupModel.groupModelId = ISNULL(@groupModelId, dbo.GroupModel.groupModelId) AND
		dbo.Companies.companyId = ISNULL(@companyId, dbo.Companies.companyId) AND
		(
			(@model1Id IS NOT NULL AND dbo.Models.modelId IN (@modelId, @model1Id, @model2Id, @model3Id, @model4Id)) OR 
			(@model1Id IS NULL)
		) AND 
		(
			(@groupModel1Id IS NOT NULL AND dbo.GroupModel.groupModelId IN (@groupModelId,@groupModel1Id, @groupModel2Id, @groupModel3Id, @groupModel4Id)) OR 
			(@groupModel1Id IS NULL) 
		) AND
		(
			(@modification1Id IS NOT NULL AND dbo.PartView.modificationId IN (@modificationId, @modification1Id, @modification2Id, @modification3Id, @modification4Id, @modification5Id)) OR 
			(@modification1Id IS NULL)
		)
		AND
		dbo.Modifications.modificationId = ISNULL(@modificationId, dbo.Modifications.modificationId)) result
	GROUP BY categoryId, subCategoryId
	ORDER BY categoryId, subCategoryId
ELSE  SELECT COUNT(*) AS countPart, categoryId, subCategoryId  FROM (
SELECT dbo.PartView.categoryId, dbo.PartView.subCategoryId
FROM  dbo.Models INNER JOIN
         dbo.PartView ON dbo.Models.modelId = dbo.PartView.modelId INNER JOIN
         dbo.Companies ON dbo.Models.companyId = dbo.Companies.companyId LEFT OUTER JOIN
         dbo.GroupModel ON dbo.Models.groupModelId = dbo.GroupModel.groupModelId
	WHERE  
		dbo.PartView.deleted = 0 AND 
		(@hasImages = 0  OR mainImageId <> 0) AND
		dbo.PartView.bus = ISNULL(@bus, dbo.PartView.bus) AND 
		dbo.PartView.suspended = ISNULL(@suspended, dbo.PartView.suspended) AND 
		dbo.PartView.userId = ISNULL(@userId, dbo.PartView.userId) AND
		dbo.Companies.companyId = ISNULL(@companyId, dbo.Companies.companyId) AND
		(
			(@model1Id IS NOT NULL AND dbo.Models.modelId IN (@modelId, @model1Id, @model2Id, @model3Id, @model4Id)) OR 
			(@model1Id IS NULL)
		)) result
	GROUP BY categoryId, subCategoryId
	ORDER BY categoryId, subCategoryId
RETURN 0
GO