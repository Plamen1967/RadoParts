CREATE PROCEDURE [dbo].[GetNumberPartsPerUser]
	@userId INT = 0,
	@carnumberParts INT OUTPUT,
	@busnumberParts INT OUTPUT
AS
	SELECT
		@carnumberParts = count(*) 
	FROM 
		dbo.PartView 
	WHERE 
		userId = @userId and 
		deleted = 0 and 
		bus = 0

	SELECT
		@busnumberParts = count(*) 
	FROM 
		dbo.PartView 
	WHERE 
		userId = @userId and 
		deleted = 0 and 
		bus = 1

RETURN @@ROWCOUNT
