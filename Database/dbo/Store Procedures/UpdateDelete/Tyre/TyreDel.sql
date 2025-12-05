CREATE PROCEDURE [dbo].[TyreDel]
	@tyreId BigInt,
	@userId int
AS
	UPDATE 
		Tyres
	SET 
		deleted = 1
	WHERE 
		tyreId = @tyreId AND userId = @userId


RETURN @@ROWCOUNT
