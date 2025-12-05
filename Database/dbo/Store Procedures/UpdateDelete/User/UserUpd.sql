CREATE PROCEDURE [dbo].[UserUpd]
        @userId INT,
        @companyName NVARCHAR (50),
        @firstName NVARCHAR (50),
        @fatherName NVARCHAR (50),
        @lastName NVARCHAR (50),
        @phone NVARCHAR (50),
        @phone2 NVARCHAR (50),
        @viber NVARCHAR (50),
        @whats NVARCHAR (50),
        @email NVARCHAR (50),
        @address NVARCHAR (100),
        @city NVARCHAR (50),
        @userName NVARCHAR (50),
        @dealer INT,
        @regionId INT,
        @webPage NVARCHAR (100),
        @description  NVARCHAR (500),
        @imageId INT

AS
	UPDATE [User]  SET 
        companyName     = RTRIM(@companyName),
        firstName       = RTRIM(@firstName),
        fatherName      = RTRIM(@fatherName),
        lastName        = RTRIM(@lastName),
        phone           = RTRIM(@phone),
        phone2          = RTRIM(@phone2),
        viber           = RTRIM(@viber),
        whats           = RTRIM(@whats),
        email           = RTRIM(@email),
        [address]       = RTRIM(@address),
        city            = RTRIM(@city),
        userName        = RTRIM(@userName),
        regionId        = @regionId,
        webPage         = @webPage,
        description     = @description,
        imageId         = @imageId
    WHERE userId = @userId

RETURN @@ROWCOUNT
