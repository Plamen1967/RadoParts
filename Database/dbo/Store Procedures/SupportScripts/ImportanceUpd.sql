CREATE PROCEDURE [dbo].[ImportanceUpd]
AS
	UPDATE Companies 
	SET important = 0

	UPDATE Companies
	SET important = 1
	WHERE companyName in ('Audi', 'BMW', 'Citroen', 
						  'Ford', 'Honda', 'Mazda', 
						  'Mercedes-Benz', 'Nissan', 'Opel', 'Renault', 'Toyota', 'Volkswagen', 'Peugeot')

RETURN 0
