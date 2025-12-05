CREATE PROCEDURE [dbo].[CarById]
	@carId BIGINT
AS
	SELECT 
		* 
	FROM 
		dbo.CarView 
	WHERE 
		dbo.CarView.carId = @carId AND 
		deleted = 0

RETURN @@ROWCOUNT
