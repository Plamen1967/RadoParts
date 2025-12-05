CREATE PROCEDURE dbo.[ComponyBusAll]
AS
	SELECT * FROM Companies  WHERE bus = 1 ORDER BY companyName

RETURN @@ROWCOUNT
