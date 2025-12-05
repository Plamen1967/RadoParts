CREATE PROCEDURE [dbo].[CarsDel]
	@carId BIGINT,
	@userId int
AS
 --	Delete Car and Parts
	UPDATE Cars 
	SET 
		deleted = 1,
		deleteDateTime = CURRENT_TIMESTAMP
	WHERE
		carId = @carId AND
		userId = @userId

	UPDATE 
		Parts 
	SET 
		deleted = 1,
		deleteDateTime = CURRENT_TIMESTAMP
	WHERE 
		Parts.carId = @carId AND
		Parts.userId = @userId	

 --	Delete Images for a car 
	UPDATE 
		ImageData 
	SET 
		deleted = 1,
		deleteDateTime = CURRENT_TIMESTAMP
	WHERE 
		objectId = @carId AND
		userId = @userId


 --	Delete Images for a Car's Parts 
	UPDATE 
		ImageData 
	SET 
		deleted = 1,
		deleteDateTime = CURRENT_TIMESTAMP
	WHERE
		objectId in ( 
						SELECT
							Parts.partId FROM Parts 
						WHERE 
							Parts.carId = @carId AND
							Parts.userId = @userId 
					)	 
RETURN @@ROWCOUNT
