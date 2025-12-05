CREATE PROCEDURE [dbo].[GetNextId]
@lastId bigint OUTPUT
AS
	SELECT @lastId = MAX(Id) from IdView
RETURN
