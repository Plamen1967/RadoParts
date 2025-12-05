CREATE PROCEDURE [dbo].[GetMainPicture]
	@id BIGINT,
	@mainPicture nvarchar(max)  OUTPUT
AS
	SELECT @mainPicture = mainPicture FROM 
	(
		SELECT 
			mainPicture 
		FROM 
			dbo.PartView
		WHERE 
			partId = @id AND 
			LEN(TRIM(mainPicture)) <> 0 AND 
			deleted = 0
		UNION
		SELECT 
			mainPicture 
		FROM 
			dbo.CarView
		WHERE 
			carId = @id AND 
			LEN(TRIM(mainPicture)) <> 0 AND
			deleted = 0
		) as U

		PRINT  @mainPicture
	 SET @mainPicture = ISNULL(@mainPicture, '')
RETURN @@ROWCOUNT
