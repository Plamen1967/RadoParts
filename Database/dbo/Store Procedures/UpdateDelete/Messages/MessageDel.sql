CREATE PROCEDURE [dbo].[MessageDel]
	@id int = 0,
	@userId int
AS
	DELETE 
		Messages 
	WHERE 
		(id = @id OR originalMsgId = @id) 
	AND 
		(receiveUserId = @userId or sendUserId = @userId)

RETURN @@ROWCOUNT
