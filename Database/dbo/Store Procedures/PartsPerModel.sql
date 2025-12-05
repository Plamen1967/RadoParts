CREATE PROCEDURE [dbo].[PartsPerModel]
AS
    SELECT 
        dbo.Models.modelId, COUNT(dbo.Models.modelId) AS countParts
    FROM   
        dbo.PartView INNER JOIN
        dbo.Models ON dbo.PartView.modelId = dbo.Models.modelId   
    WHERE  
        dbo.PartView.deleted = 0
    GROUP BY dbo.Models.modelId
RETURN 0
