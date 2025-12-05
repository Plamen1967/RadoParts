CREATE PROCEDURE [dbo].[BusinessCardGet]
	@userId BIGINT
AS
	SELECT 
	    *
    FROM 
        BusinessCard
    WHERE
        userId = @userId AND  deleted = 0
RETURN @@ROWCOUNT
