CREATE PROCEDURE [dbo].[ModificationIns]
	@modificationName VARCHAR(50),
	@modelId INT,
	@yearFrom INT,
	@yearTo INT,
	@powerHP INT,
	@engine INT,
	@doors INT,
	@kupe INT,
	@returnModificationId int OUTPUT

AS
BEGIN	
	SELECT @returnModificationId = MAX(modificationId)+1 FROM Modifications
	INSERT INTO 
		Modifications 
	(
		modificationId,
		modificationName,
		modelId, 
		yearFrom, 
		yearTo,
		powerHP,
		engine,
		doors,
		kupe
	) 
	VALUES 
	(
		@returnModificationId,
		@modificationName,
		@modelId,
		@yearFrom, 
		@yearTo,
		@powerHP,
		@engine,
		@doors,
		@kupe
	)

update Models set yearFrom = 
	(SELECT ISNULL(MIN(Modifications.yearFrom), 0) FROM  dbo.Models as M INNER JOIN dbo.Modifications ON M.modelId = dbo.Modifications.modelId WHERE Models.modelId = M.modelId) 
update Models set yearTo = 
	(SELECT ISNULL(MAX(Modifications.yearTo), 0) FROM  dbo.Models as M INNER JOIN dbo.Modifications ON M.modelId = dbo.Modifications.modelId WHERE Models.modelId = M.modelId) 

END
RETURN @@ROWCOUNT
