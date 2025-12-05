CREATE PROCEDURE [dbo].[GetFilterById]
	@filterId BIGINT
AS
	SELECT 
		* 
	FROM 
		FilterPart 
	WHERE 
		filterId = @filterId
RETURN @@ROWCOUNT
