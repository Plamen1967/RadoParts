CREATE PROCEDURE [dbo].[LogMessage]
	@message NVARCHAR(MAX),
	@tickCount INT
AS
	INSERT INTO Exception (message, tickCount) VALUES (@message, @tickCount)
RETURN 0
