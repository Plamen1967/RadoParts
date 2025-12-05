CREATE PROCEDURE [dbo].[CheckoutItemsCars]
	@items VARCHAR
AS
	SELECT 
		* 
	FROM 
		dbo.CarView 
	WHERE 
		carId in (@items)

RETURN @@ROWCOUNT
