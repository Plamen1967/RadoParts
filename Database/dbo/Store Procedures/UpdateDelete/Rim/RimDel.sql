CREATE PROCEDURE [dbo].[RimDel]
	@rimId BIGINT,
	@userId int
AS
	UPDATE 
		Rim
	SET 
		deleted = 1
	WHERE
		rimId = @rimId AND userId = @userId

RETURN 0
