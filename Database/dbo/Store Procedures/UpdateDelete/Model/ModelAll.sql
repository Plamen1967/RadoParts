CREATE PROCEDURE [dbo].[ModelAll]
AS
	SELECT 
		* 
	FROM 
		Models 
	ORDER BY 
		modelName

RETURN @@ROWCOUNT
