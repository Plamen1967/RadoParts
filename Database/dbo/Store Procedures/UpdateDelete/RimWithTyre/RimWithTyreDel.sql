CREATE PROCEDURE [dbo].[RimWithTyreDel]
	@rimWithTyreId BIGINT,
	@userId int
AS
	UPDATE RimWithTyre SET deleted = 1
	WHERE rimWithTyreId =  @rimWithTyreId AND userId = @userId
RETURN 0
