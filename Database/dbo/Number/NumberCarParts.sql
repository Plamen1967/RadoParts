CREATE PROCEDURE [dbo].[NumberCarParts]
AS
	SELECT count(*) as number, companyId, groupModelId, modelId, modificationId
	from (SELECT companyId, groupModelId, modelId, modificationId 
		FROM CarView WHERE suspended = 0 AND groupModelId is not null and modelId is not null and modificationId is not null and companyId is not null) as PartViewSelect
	group by companyId, groupModelId, modelId, modificationId
RETURN 0
