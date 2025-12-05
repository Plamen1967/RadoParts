CREATE PROCEDURE [dbo].[PartPerCar]
	@userId bigint
AS
	SELECT TOP (1000) 
		dbo.CarView.carId, COUNT(*) AS Count
	FROM  
		dbo.CarView INNER JOIN
        dbo.Parts ON dbo.CarView.carId = dbo.Parts.carId
	WHERE dbo.CarView.userId = @userId and dbo.Parts.deleted = 0


	GROUP BY dbo.CarView.carId
RETURN 0
