CREATE PROCEDURE [dbo].[RimUpd]
	@rimId BIGINT,
    @companyId INT,
    @modelId INT,
    @rimWidth INT,
    @rimMaterial INT,
    @rimOffset INT,
    @rimBoltCount INT,
    @rimBoltDistance INT,
    @rimCenter INT,
    @price DECIMAL, 
    @description NVARCHAR(500), 
    @mainImageId INT,
    @mainPicture NVARCHAR(200), 
    @userId INT, 
    @modifiedTime BIGINT,
    @count INT 
AS
	UPDATE Rim 
    SET
        companyId = @companyId,
        modelId = @modelId,
        rimWidth = @rimWidth,
        rimMaterial = @rimMaterial,
        rimOffset = @rimOffset,
        rimBoltCount = @rimBoltCount,
        rimBoltDistance = @rimBoltDistance,
        rimCenter = @rimCenter,
        price = @price, 
        [description] = @description, 
        mainImageId = @mainImageId,
        mainPicture = @mainPicture, 
        modifiedTime = @modifiedTime,
        [count] = @count

    WHERE rimId = @rimId and userId = @userId
RETURN 0
