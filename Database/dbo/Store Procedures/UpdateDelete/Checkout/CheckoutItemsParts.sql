CREATE PROCEDURE [dbo].[CheckoutItemsParts]
	@items VARCHAR
AS
	SELECT 
		* 
	FROM 
		dbo.PartView 
	WHERE 
		partId in (@items)
RETURN @@ROWCOUNT
