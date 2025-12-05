CREATE VIEW [dbo].[ModificationPartCountView]
	AS SELECT SUM(count) as Count, modificationId 
FROM 
(
	SELECT COUNT(*) as count, dbo.PartFilterView.modificationId as modificationId
	FROM  PartFilterView
	WHERE PartFilterView.bus = 0
	GROUP BY dbo.PartFilterView.modificationId

) as result GROUP BY modificationId