CREATE PROCEDURE [dbo].[MessageIns]
	@msgDate bigint,
	@sendUserId int,
	@receiveUserId int,
	@previousMsgId bigint,
	@originalMsgId bigInt,
	@message NVARCHAR(200),
	@partId bigInt = 0,
	@sendername  NVARCHAR(50),
	@email  NVARCHAR(200),
	@request NVARCHAR(200),
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
		sendername,
		email,
		request,
		isCar,
		isRead
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
		@sendername,
		@email,
		@request,
		@isCar,
		0
		)

RETURN @@ROWCOUNT
