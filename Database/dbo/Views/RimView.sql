CREATE VIEW [dbo].[RimView]
AS 
    SELECT 
        dbo.Rim.*, dbo.[User].suspended as suspended
    FROM  
        dbo.Rim INNER JOIN
        dbo.[User] ON dbo.Rim.userId = dbo.[User].userId
    WHERE (dbo.Rim.deleted = 0)
