CREATE PROCEDURE [dbo].[CarsAll]
    @carId              BIGINT = NULL
AS 
	SELECT * FROM dbo.CarView
    WITH (NOLOCK) 
	WHERE   carId               = @carId AND
            deleted  = 0
RETURN @@ROWCOUNT
