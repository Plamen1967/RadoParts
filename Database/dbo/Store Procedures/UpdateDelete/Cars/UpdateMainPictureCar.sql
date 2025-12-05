CREATE PROCEDURE [dbo].[UpdateMainPictureCar]
	@cartId BIGINT,
	@mainPicture NVARCHAR(200),
	@mainImageId INT,
	@userId INT
AS
	UPDATE 
		Cars
	SET 
		mainPicture = @mainPicture,
		mainImageId = @mainImageId
	WHERE 
		carId = @cartId AND 
		userId = @userId


RETURN 0
