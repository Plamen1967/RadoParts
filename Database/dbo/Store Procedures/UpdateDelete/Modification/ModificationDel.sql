CREATE PROCEDURE [dbo].[ModificationDel]
	@modificationId INT
AS
	DELETE FROM 
		Modifications 
	WHERE 
		modificationId = @modificationId

RETURN @@ROWCOUNT
