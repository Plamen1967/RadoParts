CREATE PROCEDURE [dbo].[ModelIns]
	@companyId INT,
	@groupModelId INT,
	@modelName NVARCHAR(50),
	@yearFrom INT,
	@yearTo INT,
	@returnModelId INT OUTPUT
AS
	SELECT @returnModelId = MAX(modelId) +1 FROM Models
	INSERT INTO 
		Models
	(
		modelId,
		companyId,
		groupModelId,
		modelName,
		yearFrom,
		yearTo
	)
	VALUES
	(
		@returnModelId,
		@companyId,
		@groupModelId,
		@modelName,	
		@yearFrom,
		@yearTo
	)

RETURN @@ROWCOUNT
