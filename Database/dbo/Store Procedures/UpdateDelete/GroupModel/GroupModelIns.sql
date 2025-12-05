CREATE PROCEDURE [dbo].[GroupModelIns]
	@groupModelId INT,
	@groupModelName VARCHAR(50),
	@companyId INT
AS
	INSERT INTO 
	GroupModel
	(
		groupModelId,
		groupModelName,
		companyId
	)
	VALUES
	(
		@groupModelId,
		@groupModelName,
		@companyId
	)

RETURN @@ROWCOUNT
