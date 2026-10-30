CREATE PROCEDURE [dbo].[CarsUpd]
    @carId          BIGINT,
    @modelId        INT,
    @modificationId INT,
    @year           INT,
    @vin            NVARCHAR (20),
    @regNumber      NVARCHAR (50),
    @description    NVARCHAR (100),
    @price          DECIMAL (18),
    @powerkWh       INT,
    @powerBHP       INT,
    @engineType     INT,
    @engineModel    NCHAR (10),
    @userId         INT,
    @millage         INT,
    @regionId       INT,
    @gearboxType    INT,
    @modifiedTime   BIGINT,
    @mainPicture    NVARCHAR(200),
    @mainImageId    INT,
    @approved       INT,
	@imageCount		INT
AS
	UPDATE Cars SET 
        modelId         = @modelId, 
        modificationId  = @modificationId, 
        [year]          = @year,  
        vin             = RTRIM(@vin), 
        regNumber       = RTRIM(@regNumber), 
        [description]   = RTRIM(@description), 
        price           = @price, 
        powerkWh        = @powerkWh, 
        powerBHP        = @powerBHP, 
        engineType      = @engineType, 
        engineModel     = RTRIM(@engineModel),
        millage          = @millage,
        regionId        = @regionId,
        gearboxType     = @gearboxType,
        modifiedTime    = @modifiedTime,
        mainPicture     = @mainPicture,
        mainImageId     = @mainImageId,
        approved        = @approved,
        imageCount		= @imageCount
    WHERE carId = @carId AND 
          userId = @userId

    UPDATE Parts SET 
        modificationId  = @modificationId, 
        powerkWh        = @powerkWh, 
        powerBHP        = @powerBHP, 
        engineType      = @engineType, 
        engineModel     = RTRIM(@engineModel),
        millage         = @millage,
        regionId        = @regionId,
        gearboxType     = @gearboxType
    WHERE carId = @carId AND 
          userId = @userId
RETURN @@ROWCOUNT
