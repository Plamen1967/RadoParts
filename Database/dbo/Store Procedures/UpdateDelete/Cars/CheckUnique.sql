CREATE PROCEDURE [dbo].[CheckUnique]
	@regNumber VARCHAR(50),
	@userId int,
	@bus INT,
	@result INT OUTPUT
AS
	SELECT @result = COUNT(*) FROM Cars WHERE userId = @userId and regNumber = @regNumber and bus = @bus;
RETURN @result
