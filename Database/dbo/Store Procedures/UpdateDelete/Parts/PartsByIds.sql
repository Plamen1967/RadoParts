CREATE PROCEDURE [dbo].[PartsByIds]
	@id1 BIGINT = 0,
	@id2 BIGINT = 0,
	@id3 BIGINT = 0,
	@id4 BIGINT = 0,
	@id5 BIGINT = 0,
	@id6 BIGINT = 0,
	@id7 BIGINT = 0,
	@id8 BIGINT = 0,
	@id9 BIGINT = 0,
	@id10 BIGINT = 0
AS
	SELECT * FROM 
		dbo.PartView 
	WHERE 
		(partId = @id1 OR 
		partId = @id2 OR 
		partId = @id3 OR 
		partId = @id4 OR 
		partId = @id5 OR 
		partId = @id6 OR 
		partId = @id7 OR 
		partId = @id8 OR 
		partId = @id9 OR 
		partId = @id10 ) 
RETURN 0
