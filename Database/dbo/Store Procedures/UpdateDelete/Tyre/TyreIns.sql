CREATE PROCEDURE [dbo].[TyreIns]
	@tyreId BIGINT, 
    @tyreCompanyId INT, 
    @tyreWidth INT, 
    @tyreHeight INT, 
    @tyreRadius INT, 
    @tyreType INT, 
    @price DECIMAL, 
    @description NVARCHAR(500), 
    @mainImageId INT,
    @mainPicture NVARCHAR(200), 
    @userId INT, 
    @modifiedTime BIGINT,
    @regionId INT,
    @count INT,
    @month INT,
    @year INT
AS
    INSERT INTO Tyres
    (
	    tyreId, 
        tyreCompanyId, 
        tyreWidth, 
        tyreHeight, 
        tyreRadius, 
        tyreType, 
        price, 
        [description],
        regionId,
        mainImageId,
        mainPicture, 
        userId, 
        approved, 
        createdTime, 
        modifiedTime,
        [count],
        [month],
        [year]
    )
    VALUES
    (
	    @tyreId, 
        @tyreCompanyId, 
        @tyreWidth, 
        @tyreHeight, 
        @tyreRadius, 
        @tyreType, 
        @price, 
        @description, 
        @regionId,
        @mainImageId,
        @mainPicture, 
        @userId, 
        0, 
        @modifiedTime, 
        @modifiedTime,
        @count,
        @month,
        @year
    )
    
RETURN 0
