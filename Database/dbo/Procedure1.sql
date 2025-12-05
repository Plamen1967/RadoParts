CREATE PROCEDURE [dbo].[PartsIns]
    @partId            INT,
    @carId             INT,
    @subcategoryid     INT,
    @partName          NVARCHAR,
    @PriceToSell       DECIMAL (18),
    @leftRightPosition INT,
    @frontBackPosition INT,
    @modelId           INT,
    @partNumber        NCHAR (10),
    @engineType        INT,
    @engineModel       NCHAR (10),
    @year              INT,
    @powerkWh          INT,
    @powerBHP          INT
AS
	UPDATE Parts SET 
     carId = @carId,
     subcategoryid = @subcategoryid,
     partName = @partName,
     PriceToSell = @PriceToSell,
     leftRightPosition = @leftRightPosition,
     frontBackPosition = @frontBackPosition,
     modelId = @modelId,
     partNumber = @partNumber,
     engineType = @engineType,
     engineModel = @engineModel,
     year = @year,
     powerkWh = @powerkWh,
     powerBHP = @powerBHP
     WHERE partId = @partId
RETURN 0
AS
	SELECT @param1, @param2
RETURN 0
