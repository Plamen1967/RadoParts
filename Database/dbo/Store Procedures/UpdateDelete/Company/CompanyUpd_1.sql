CREATE PROCEDURE [dbo].[CompanyUpd]
	@companyId INT,
	@companyName NVARCHAR(50),
	@important INT
AS
	UPDATE 
		Companies
	SET
		companyName = @companyName,
		important = @important
	WHERE
		companyId = @companyId

RETURN @@ROWCOUNT
