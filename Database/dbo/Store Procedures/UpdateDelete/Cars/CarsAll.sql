CREATE PROCEDURE [dbo].[CarsAll]
    @carId              BIGINT = NULL
AS 
	SELECT * FROM dbo.Cars
    WITH (NOLOCK) 
	WHERE   carId               = @carId AND
            deleted  = 0
RETURN @@ROWCOUNT
