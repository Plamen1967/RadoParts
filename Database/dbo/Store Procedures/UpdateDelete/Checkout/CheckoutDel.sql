CREATE PROCEDURE [dbo].[CheckoutDel]
	@Id bigint,
	@userId int
AS
	DELETE FROM
		Checkout 
    WHERE 
		Id = @Id and 
		userId = @userId 
RETURN 0
