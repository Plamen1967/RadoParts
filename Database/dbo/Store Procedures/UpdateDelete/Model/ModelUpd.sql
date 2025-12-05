CREATE PROCEDURE [dbo].[ModelUpd]
	@modelId INT,
	@modelName NVARCHAR(50)
AS
	UPDATE 
		Models 
	SET 
		modelName = @modelName 
	WHERE 
		modelId = @modelId

RETURN @@ROWCOUNT
