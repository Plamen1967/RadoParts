CREATE PROCEDURE [dbo].[CheckIds]
	@ids VARCHAR(MAX)
AS
	SELECT carId FROM 
		CarView

	--WHERE 
	--	carId in (SELECT value from Split_String(@ids, ','))

	--UNION 
	--SELECT partId FROM 
	--	Parts 
	--WHERE 
	--	partId in (SELECT value from Split_String(@ids, ','))

RETURN 0
