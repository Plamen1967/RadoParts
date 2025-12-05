CREATE PROCEDURE [dbo].[UserDel]
	@userId int
AS
-- Delete User
	UPDATE [User] 
	SET 
		deleted = 1,
		deleteDateTime = CURRENT_TIMESTAMP
	WHERE 
		userId = @userId and 
		dealer <> 2

-- Delete Cars and Parts
	UPDATE 
		Parts 
	SET 
		deleted = 1,
		deleteDateTime = CURRENT_TIMESTAMP
	WHERE 
		userId = @userId

	UPDATE
		Cars 
	SET 
		deleted = 1,
		deleteDateTime = CURRENT_TIMESTAMP
	WHERE 
		userId = @userId

-- Delete Images
	UPDATE 
		ImageData 
	SET 
		deleted = 1,
		deleteDateTime = CURRENT_TIMESTAMP
	WHERE
		userId = @userId

RETURN @@ROWCOUNT
