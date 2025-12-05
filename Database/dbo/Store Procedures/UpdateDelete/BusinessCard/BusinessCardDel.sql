CREATE PROCEDURE [dbo].[BusinessCardDel]
	@userId BIGINT
AS
	UPDATE 
        BusinessCard 
    SET 
        deleted = 1,
        deleteDateTime = CURRENT_TIMESTAMP
    WHERE 
        userId = @userId

    UPDATE [User] SET imageId = 0 WHERE userId = @userId

RETURN @@ROWCOUNT
