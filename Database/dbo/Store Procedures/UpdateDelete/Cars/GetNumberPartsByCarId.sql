CREATE PROCEDURE [dbo].[GetNumberPartsByCarId]
	@carId BIGINT = 0
AS
	SELECT 
		COUNT(*) AS Count
	FROM  
		dbo.CarView INNER JOIN
        dbo.Parts ON dbo.CarView.carId = dbo.Parts.carId
	WHERE 
		dbo.CarView.carId = @carId

RETURN 0
