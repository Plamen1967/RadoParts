CREATE PROCEDURE [dbo].[GetUserCount]
	@userId INT = 0,
	@partCarCount INT OUTPUT,
	@partBusCount INT OUTPUT,
	@carCount INT OUTPUT,
	@busCount INT OUTPUT,
	@rimCount INT OUTPUT,
	@tyreCount INT OUTPUT,
	@rimWithtyreCount INT OUTPUT
AS
	SELECT
		@partCarCount = count(*) 
	FROM 
		dbo.PartView 
	WHERE 
		userId = @userId and bus = 0

	SELECT
		@partBusCount = count(*) 
	FROM 
		dbo.PartView 
	WHERE 
		userId = @userId and bus = 1

	SELECT
		@carCount = count(*) 
	FROM 
		dbo.CarView 
	WHERE 
		userId = @userId and bus = 0

	SELECT
		@busCount = count(*) 
	FROM 
		dbo.CarView 
	WHERE 
		userId = @userId and bus = 1

	SELECT
		@tyreCount = count(*) 
	FROM 
		dbo.RimWithTyreView 
	WHERE 
		userId = @userId and dbo.RimWithTyreView.itemType = 3
	SELECT
		@rimCount = count(*) 
	FROM 
		dbo.RimWithTyreView 
	WHERE 
		userId = @userId and dbo.RimWithTyreView.itemType = 4
	SELECT
		@rimWithtyreCount = count(*) 
	FROM 
		dbo.RimWithTyreView 
	WHERE 
		userId = @userId and dbo.RimWithTyreView.itemType = 5

RETURN 0

