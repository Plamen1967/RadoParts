CREATE PROCEDURE [dbo].[RimWithTyreById]
	@rimWithTyreId bigint
AS
	SELECT * 
	FROM 
		RimWithTyre 
	WHERE 
		rimWithTyreId = @rimWithTyreId

RETURN @@ROWCOUNT
