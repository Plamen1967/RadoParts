CREATE PROCEDURE [dbo].[MarkReadUpd]
	@originalMsgId int,
	@receiveUserId int
AS
	UPDATE 
		Messages
	SET
		[read] = 1
	WHERE 
		originalMsgId = @originalMsgId and 
		receiveUserId = @receiveUserId
	

RETURN @@ROWCOUNT
