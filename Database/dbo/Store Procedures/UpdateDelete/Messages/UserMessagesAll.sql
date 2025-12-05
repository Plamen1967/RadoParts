CREATE PROCEDURE [dbo].[UserMessagesAll]
	@userId bigInt
AS
	SELECT * 
	from Messages 
	where receiveUserId = @userId
RETURN @@ROWCOUNT
