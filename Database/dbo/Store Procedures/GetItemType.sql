CREATE PROCEDURE [dbo].[GetItemType]
	@id BIGINT
AS
	SELECT carId as [id], 1 as itemType FROM CarView WHERE carId = @id
	UNION
	SELECT partId as [id], 2 as itemType FROM PartView WHERE partId = @id
	UNION 
	SELECT rimWithTyreId as [id], itemType as itemType FROM RimWithTyreView WHERE rimWithTyreId = @id

RETURN 0
