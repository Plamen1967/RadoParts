CREATE PROCEDURE [dbo].[RimById]
	@rimId bigint
AS
	SELECT * FROM Rim WHERE rimId = @rimId

RETURN @@ROWCOUNT
