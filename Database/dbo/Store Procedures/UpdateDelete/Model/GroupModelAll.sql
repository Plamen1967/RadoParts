CREATE PROCEDURE [dbo].[GroupModelAll]
AS
	SELECT 
		* 
	FROM 
		GroupModel
	ORDER BY companyId, groupModelName
RETURN 0
