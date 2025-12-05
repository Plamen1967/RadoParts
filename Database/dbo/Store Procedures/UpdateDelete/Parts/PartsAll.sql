CREATE PROCEDURE [dbo].[PartsAll]
    @carId              BIGINT = NULL,
    @companyId          BIGINT = NULL,
    @modelId            BIGINT = NULL,
    @modificationId     BIGINT = NULL,
    @year               INT = NULL,
    @categoryId         BIGINT = NULL,
    @subCategoryId      BIGINT = NULL,
    @engineType         INT = NULL,
    @gearboxType        INT = NULL,
    @powerBHP           INT = NULL,
    @regionId           INT = NULL,
    @userId             INT = NULL,
    @partNumber         VARCHAR(100) = '%%',
    @param1             VARCHAR(100) = '%%',
    @param2             VARCHAR(100) = '',
    @param3             VARCHAR(100) = '',
    @param4             VARCHAR(100) = '',
    @param5             VARCHAR(100) = '',
    @param6             VARCHAR(100) = ''

AS 
	SELECT * FROM dbo.PartView
    WITH (NOLOCK) 
	WHERE   carId               = ISNULL(@carId, carId) AND
            modelId             IN (SELECT modelId FROM Models WHERE companyId = ISNULL(@companyId, companyId)) AND
            modelId             = ISNULL(@modelId, modelId) AND
            modificationId      = ISNULL(@modificationId, modificationId) AND
            year                = ISNULL(@year, year) AND 
		    categoryId          = ISNULL(@categoryId, categoryId) AND 	
		    subCategoryId       = ISNULL(@subCategoryId, subCategoryId) AND 
		    engineType          = ISNULL(@engineType, engineType) AND
		    gearboxType         = ISNULL(@gearboxType, gearboxType) AND 
		    powerBHP            = ISNULL(@powerBHP, powerBHP) AND
            regionId            = ISNULL(@regionId, regionId) AND
            partNumber          LIKE @partNumber AND
            userId              = ISNULL(@userId, userId) AND
            deleted             = 0   AND
            (keyword LIKE @param1 OR keyword LIKE @param2 OR keyword LIKE @param3 OR keyword LIKE @param4 OR keyword LIKE @param5 OR keyword LIKE @param6)

RETURN @@ROWCOUNT
