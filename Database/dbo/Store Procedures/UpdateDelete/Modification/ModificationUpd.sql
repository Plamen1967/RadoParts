CREATE PROCEDURE [dbo].[ModificationUpd]
	@modificationId INT,
	@modificationName NVARCHAR(50),
	@yearFrom INT,
	@yearTo INT,
	@powerHP INT,
	@engine INT,
	@doors INT,
	@kupe INT
AS
	UPDATE 
		Modifications
	SET 
		yearFrom = @yearFrom,
		yearTo = @yearTo,
		powerHP = @powerHP,
		engine = @engine,
		doors = @doors,
		kupe = @kupe,
		modificationName = @modificationName
	WHERE
		modificationId = @modificationId

update Models set yearFrom = 
	(SELECT ISNULL(MIN(Modifications.yearFrom), 0) FROM  dbo.Models as M INNER JOIN dbo.Modifications ON M.modelId = dbo.Modifications.modelId WHERE Models.modelId = M.modelId) 
update Models set yearTo = 
	(SELECT ISNULL(MAX(Modifications.yearTo), 0) FROM  dbo.Models as M INNER JOIN dbo.Modifications ON M.modelId = dbo.Modifications.modelId WHERE Models.modelId = M.modelId) 

RETURN @@ROWCOUNT
