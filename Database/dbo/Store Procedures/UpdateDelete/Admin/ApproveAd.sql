CREATE PROCEDURE [dbo].[ApproveAd]
	@id BIGINT,
	@approved int
AS
	UPDATE 
		Parts
	SET approved = @approved 
	WHERE partId = @id

	UPDATE 
		Cars
	SET approved = @approved 
	WHERE carId = @id

	UPDATE 
		RimWithTyre
	SET approved = @approved 
	WHERE rimWithTyreId = @id

RETURN @@ROWCOUNT
