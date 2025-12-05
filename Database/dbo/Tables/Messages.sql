CREATE TABLE [dbo].[Messages]
(
	[id] BIGINT IDENTITY NOT NULL, 
    [msgDate] BIGINT NOT NULL, 
    [sendUserId] INT NOT NULL, 
    [receiveUserId] INT NOT NULL, 
    [previousMsgId] BIGINT NOT NULL, 
    [message] NVARCHAR(200) NOT NULL DEFAULT '', 
    [originalMsgId] BIGINT NOT NULL DEFAULT 0, 
    [partId] BIGINT NOT NULL DEFAULT 0, 
    [isCar] INT NOT NULL DEFAULT 0, 
    [read] INT NOT NULL DEFAULT 0
)
