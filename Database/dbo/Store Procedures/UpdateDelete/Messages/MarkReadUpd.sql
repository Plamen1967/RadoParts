CREATE PROCEDURE [dbo].[MarkReadUpd]
	@originalMsgId int,
	@receiveUserId int,
	@read Bit = 1
AS
	UPDATE 
		Messages
	SET
        isRead = @read
	WHERE 
		originalMsgId = @originalMsgId and 
		receiveUserId = @receiveUserId
	

RETURN @@ROWCOUNT
