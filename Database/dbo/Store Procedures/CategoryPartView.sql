CREATE VIEW [dbo].[CategoryPartView]
	AS 
SELECT 
    COUNT(dbo.PartView.categoryId) AS Count, dbo.PartView.categoryId
FROM   
    dbo.PartView 
GROUP BY 
    dbo.PartView.categoryId
