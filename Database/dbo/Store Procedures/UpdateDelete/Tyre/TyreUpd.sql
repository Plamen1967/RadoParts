CREATE PROCEDURE [dbo].[TyreUpd]
	@tyreId BIGINT, 
    @tyreCompanyId INT, 
    @tyreWidth INT, 
    @tyreHeight INT, 
    @tyreRadius INT, 
    @tyreType INT, 
    @price DECIMAL, 
    @description NVARCHAR(500), 
    @regionId INT,
    @mainImageId INT,
    @mainPicture NVARCHAR(200), 
    @userId INT, 
    @modifiedTime BIGINT,
    @count INT,
    @month INT,
    @year INT
AS
    UPDATE Tyres SET
        tyreCompanyId =  @tyreCompanyId,
        tyreWidth = @tyreWidth, 
        tyreHeight = @tyreHeight, 
        tyreRadius = @tyreRadius, 
        tyreType = @tyreType, 
        price = @price, 
        [description] = @description, 
        regionId = @regionId,
        mainImageId = @mainImageId,
        mainPicture = @mainPicture, 
        modifiedTime = @modifiedTime,
        [count] = @count,
        [month] = @month, 
        [year] = @year
    WHERE userId = @userId AND tyreId = @tyreId

    
RETURN @@ROWCOUNT
