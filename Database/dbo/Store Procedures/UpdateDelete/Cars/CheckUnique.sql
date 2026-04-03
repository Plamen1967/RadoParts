CREATE PROCEDURE [dbo].[CheckUnique]
	@regNumber VARCHAR(50),
	@userId int,
	@bus INT,
	@result INT OUTPUT
AS
BEGIN
	SELECT @result = COUNT(*) FROM Cars WHERE userId = @userId and regNumber = @regNumber and bus = @bus and deleted = 0
END
