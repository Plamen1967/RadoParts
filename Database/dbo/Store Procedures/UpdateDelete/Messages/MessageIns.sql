CREATE PROCEDURE [dbo].[MessageIns]
	@msgDate bigint,
	@sendUserId int,
	@receiveUserId int,
	@previousMsgId bigint,
	@originalMsgId bigInt,
	@message NVARCHAR(200),
	@partId bigInt = 0,
	@isCar int = 0
AS
	INSERT INTO Messages 
	(
		msgDate, 
		sendUserId, 
		receiveUserId,
		previousMsgId,
		originalMsgId,
		[message],
		partId,
		isCar
	)
	VALUES
	(
		@msgDate, 
		@sendUserId, 
		@receiveUserId,
		@previousMsgId,
		@originalMsgId,
		@message,
		@partId,
		@isCar
		)

RETURN @@ROWCOUNT
