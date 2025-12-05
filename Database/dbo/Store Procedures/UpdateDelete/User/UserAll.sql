CREATE PROCEDURE [dbo].[UserAll]
AS
	SELECT 
		* 
	FROM
		[User] 
	WHERE 
		deleted = 0

RETURN @@ROWCOUNT
