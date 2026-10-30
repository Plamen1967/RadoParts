CREATE PROCEDURE [dbo].[UpdateRimImageCount]
@objectId int = 0
AS
DECLARE @imageCount INT
SET @imageCount = (SELECT count(*)  FROM ImageData WHERE  objectId = @objectId and deleted = 0)
UPDATE RimWithTyre SET imageCount = @imageCount WHERE rimWithTyreId = @objectId
 RETURN 0
