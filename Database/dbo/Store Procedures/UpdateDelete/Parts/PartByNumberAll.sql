CREATE PROCEDURE [dbo].[PartByNumberAll]
	@partNumber VARCHAR(MAX)
AS
	SELECT 
		* 
	FROM 
		dbo.PartView 
	WHERE 
		partNumber like @partNumber
	
RETURN 0
