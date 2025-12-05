CREATE PROCEDURE [dbo].[ValidateCarName]
	@userId int,
	@carId BIGINT OUTPUT,
	@regNumber VARCHAR(50)
AS
	SELECT @carId = carId FROM Cars WHERE userId = @userId and regNumber = @regNumber

RETURN @@ROWCOUNT
