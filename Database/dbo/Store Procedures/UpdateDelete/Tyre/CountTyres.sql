CREATE PROCEDURE [dbo].[CountTyres]
	@countTyres INT OUTPUT,
	@countRims INT OUTPUT,
	@countRimWithTyres INT OUTPUT
AS

	SELECT @countTyres = Count(*) FROM RimWithTyre WHERE itemType = 3 AND deleted = 0
	SELECT @countRims = Count(*) FROM RimWithTyre WHERE itemType = 4 AND deleted = 0
	SELECT @countRimWithTyres = Count(*) FROM RimWithTyre WHERE itemType = 5 AND deleted = 0

RETURN 0
