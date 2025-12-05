CREATE PROCEDURE [dbo].[UserIns]
( 
        @userName NVARCHAR (50),
        @email NVARCHAR (50),
        @phone NVARCHAR (50),
        @password NVARCHAR (255),
        @activationCode NVARCHAR(60),
        @dealer INT
)
AS
BEGIN
    DECLARE @returnVar INT; 

	INSERT INTO [User] (
        userName,
        email,
        phone,
        [password],
        activationCode,
        activated,
        dealer,
        deleted,
        creationDate)
VALUES(
        RTRIM(@userName),
        RTRIM(@email),
        RTRIM(@phone),
        @password,
        @activationCode,
        0,
        @dealer,
        0,
        GETDATE())

SELECT @returnVar = SCOPE_IDENTITY()

RETURN @returnVar
END;
