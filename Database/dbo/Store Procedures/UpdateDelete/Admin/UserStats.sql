CREATE PROCEDURE UserStats
	@userId BIGINT,
	@cars INT OUTPUT,
	@bus INT OUTPUT,
	@carParts INT OUTPUT,
	@busParts INT OUTPUT,
	@tyres INT OUTPUT,
	@rims INT OUTPUT,
	@rimWithTyres INT OUTPUT
AS
	SELECT @cars = COUNT(*) FROM Cars where userId = @userId AND deleted = 0 and bus = 0
	SELECT @bus = COUNT(*) FROM Cars where userId = @userId AND deleted = 0 and bus = 1
	SELECT @carParts = COUNT(*) FROM Parts where userId = @userId AND deleted = 0 and bus = 0
	SELECT @busParts = COUNT(*) FROM Parts where userId = @userId AND deleted = 0 and bus = 1
	SELECT @tyres = COUNT(*) FROM RimWithTyre where itemType = 1 and  userId = @userId AND deleted = 0
	SELECT @rims = COUNT(*) FROM RimWithTyre where itemType = 2 and  userId = @userId AND deleted = 0
	SELECT @rimWithTyres = COUNT(*) FROM RimWithTyre where itemType = 3 and  userId = @userId AND deleted = 0
	SELECT @cars as 'cars', @carParts as '@carParts',  @bus as 'bus', @busParts as '@busParts', @tyres as 'tyres', @rims as 'riims', @rimWithTyres as 'rimwithTyres'
RETURN 1