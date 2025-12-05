CREATE VIEW [dbo].[TyreView]
	AS 
    SELECT 
        dbo.Tyres.*, dbo.[User].suspended as suspended
    FROM  
        dbo.Tyres INNER JOIN
        dbo.[User] ON dbo.Tyres.userId = dbo.[User].userId
    WHERE (dbo.Tyres.deleted = 0)
