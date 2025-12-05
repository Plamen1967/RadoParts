CREATE TABLE [dbo].[Checkout]
(
	[Id]       INT            IDENTITY (1, 1) NOT NULL,
    [userId] INT NOT NULL DEFAULT 0, 
    [partId] BIGINT NOT NULL DEFAULT 0, 
    [price] DECIMAL NOT NULL DEFAULT 0, 
    [captureTime] DATETIME NOT NULL
)
