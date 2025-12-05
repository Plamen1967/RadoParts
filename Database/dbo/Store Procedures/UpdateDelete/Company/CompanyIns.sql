CREATE PROCEDURE [dbo].[CompanyIns]
	@companyId INT,
	@companyName NVARCHAR(50),
	@important INT,
	@bus SMALLINT = 0
AS
	INSERT INTO 
	Companies
	(
		companyId,
		companyName,
		important,
		bus
	)
	VALUES
	(
		@companyId,
		@companyName,
		@important,
		@bus
	)

RETURN @@ROWCOUNT
