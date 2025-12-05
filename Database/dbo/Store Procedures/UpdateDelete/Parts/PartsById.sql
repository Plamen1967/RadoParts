CREATE PROCEDURE [dbo].[PartsById]
	@partId BIGINT
AS
	SELECT * FROM 
		dbo.PartView 
	WHERE 
		partId = @partId 
RETURN 0
