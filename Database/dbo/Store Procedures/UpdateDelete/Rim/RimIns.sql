CREATE PROCEDURE [dbo].[RimIns]
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
	INSERT INTO Rim 
    (
	    rimId,
        companyId,
        modelId,
        rimWidth,
        rimMaterial,
        rimOffset,
        rimBoltCount,
        rimBoltDistance,
        rimCenter,
        price, 
        [description], 
        mainImageId,
        mainPicture, 
        userId, 
        approved, 
        createdTime, 
        modifiedTime,
        [count]
    )
    VALUES
    (
	    @rimId,
        @companyId,
        @modelId,
        @rimWidth,
        @rimMaterial,
        @rimOffset,
        @rimBoltCount,
        @rimBoltDistance,
        @rimCenter,
        @price, 
        @description, 
        @mainImageId,
        @mainPicture, 
        @userId, 
        0, 
        @modifiedTime, 
        @modifiedTime,
        @count
    )
RETURN 0
