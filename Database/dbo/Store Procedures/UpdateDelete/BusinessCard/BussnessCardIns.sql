CREATE PROCEDURE [dbo].[BusinessCardIns]
	@userId BIGINT,
	@image IMAGE
AS

	DELETE 
        BusinessCard 
    WHERE 
        userId = @userId

	INSERT INTO	     
        BusinessCard
		(userId, image)
	VALUES
		(@userId, @image)

RETURN @@ROWCOUNT
