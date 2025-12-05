CREATE PROCEDURE [dbo].[CompanyAll]
AS
	SELECT * FROM Companies ORDER BY companyName

RETURN @@ROWCOUNT
