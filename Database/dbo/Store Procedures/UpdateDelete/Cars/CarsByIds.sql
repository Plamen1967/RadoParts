CREATE PROCEDURE [dbo].[CarsByIds]
	@id1 BIGINT = 0,
	@id2 BIGINT = 0,
	@id3 BIGINT = 0,
	@id4 BIGINT = 0,
	@id5 BIGINT = 0,
	@id6 BIGINT = 0,
	@id7 BIGINT = 0,
	@id8 BIGINT = 0,
	@id9 BIGINT = 0,
	@id10 BIGINT = 0
AS
	SELECT * FROM 
		dbo.CarView 
	WHERE 
		(carId = @id1 OR 
		carId = @id2 OR 
		carId = @id3 OR 
		carId = @id4 OR 
		carId = @id5 OR 
		carId = @id6 OR 
		carId = @id7 OR 
		carId = @id8 OR 
		carId = @id9 OR 
		carId = @id10 ) AND
		deleted = 0
RETURN 0
