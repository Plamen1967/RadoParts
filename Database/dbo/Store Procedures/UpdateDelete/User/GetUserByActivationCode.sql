CREATE PROCEDURE [dbo].[GetUserByActivationCode]
	@activationCode VARCHAR(200)
AS
	SELECT * from [User] WHERE activationCode = @activationCode

RETURN @@ROWCOUNT
