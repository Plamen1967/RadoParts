CREATE VIEW [dbo].[ModificationCarCountView]
	AS SELECT SUM(count) as Count, modificationId 
FROM 
(
	SELECT COUNT(*) as count, dbo.CarView.modificationId as modificationId
	FROM  dbo.CarView
	WHERE dbo.CarView.bus = 0
	GROUP BY dbo.CarView.modificationId
) as result GROUP BY modificationId