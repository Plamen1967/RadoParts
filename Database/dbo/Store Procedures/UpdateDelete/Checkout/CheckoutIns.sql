CREATE PROCEDURE [dbo].[CheckoutIns]
	@partId bigint,
	@userId int,
	@price decimal(10,2),
    @captureTime datetime
AS
	INSERT INTO Checkout( 
        partId, 
        userId, 
        price,
        captureTime) 
    VALUES (
        @partId, 
        @userId, 
        @price,
        @captureTime)
RETURN 0
