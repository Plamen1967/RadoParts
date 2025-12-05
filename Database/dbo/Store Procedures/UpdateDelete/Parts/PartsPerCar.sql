CREATE PROCEDURE [dbo].[PartsPerCar]
	@carId bigInt,
	@userId bigint
AS
	SELECT 
		* 
	FROM 
		dbo.Parts
	WHERE 
		carId = @carId AND 
		userId = @userId AND 
		deleted = 0
RETURN 0
