CREATE PROCEDURE [dbo].[TyreById]
	@tyreId bigint
AS
	SELECT * FROM Tyres WHERE tyreId = @tyreId

RETURN @@ROWCOUNT
