CREATE PROCEDURE [dbo].[ModelDel]
	@modelId INT
AS
	DELETE FROM 
		Modifications 
	WHERE 
		modelId = @modelId

	DELETE FROM 
		Models 
	WHERE 
		modelId = @modelId

RETURN @@ROWCOUNT

