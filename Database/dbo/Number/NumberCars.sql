CREATE PROCEDURE [dbo].[NumberCars]
@userId BIGINT = NULL
AS
	SELECT count(*) as number, companyId,modelId, modificationId
	from (SELECT companyId, modelId, modificationId
		FROM CarView WHERE suspended = 0 AND userId = ISNULL(@userId, userId) and modelId is not null and companyId is not null) as CarViewSelect
	group by companyId, modelId, modificationId
RETURN 0
