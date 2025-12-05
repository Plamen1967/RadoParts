CREATE PROCEDURE [dbo].[CategoryImageUpdate]
AS
	UPDATE Categories 
	SET 
		imageName = 'engine.png'
		WHERE categoryName = 'ДВИГАТЕЛ И ОБОРУДВАНЕ'

	UPDATE Categories 
	SET 
		imageName = 'tyres.png'
		WHERE categoryName = 'ГУМИ И ДЖАНТИ'

	UPDATE Categories 
	SET 
		imageName = 'fuel.png'
		WHERE categoryName = 'ГОРИВНА СИСТЕМА'
		
	UPDATE Categories 
	SET 
		imageName = 'breaks.png'
		WHERE categoryName = 'СПИРАЧНА СИСТЕМА'

	UPDATE Categories 
	SET 
		imageName = 'steering.png'
		WHERE categoryName = 'ОКАЧВАНЕ И КОРМИЛНА УРЕДБА'

	UPDATE Categories 
	SET 
		imageName = 'cooling.png'
		WHERE categoryName = 'ОХЛАДИТЕЛНА И КЛИМАТИЧНА СИСТЕМА'
		
	UPDATE Categories 
	SET 
		imageName = 'electric.png'
		WHERE categoryName = 'ЕЛ. ОБОРУДВАНЕ'

	UPDATE Categories 
	SET 
		imageName = 'transmission.png'
		WHERE categoryName = 'СКОРОСТИ И ТРАНСМИСИЯ'

	UPDATE Categories 
	SET 
		imageName = 'tampons.png'
		WHERE categoryName = 'ТАМПОНИ, МАНШОНИ, ЛАПИ и СТОЙКИ'

	UPDATE Categories 
	SET 
		imageName = 'cori.png'
		WHERE categoryName = 'КОРИ, УПЛЪТНЕНИЯ И ПЛАСТМАСИ'

	UPDATE Categories 
	SET 
		imageName = 'pipes.png'
		WHERE categoryName = 'МАРКУЧИ, ТРЪБИЧКИ и КОЛЕКТОРИ'

	UPDATE Categories 
	SET 
		imageName = 'computers.png'
		WHERE categoryName = 'КОМПЮТРИ, МОДУЛИ и РЕЛЕТА' 

	UPDATE Categories 
	SET 
		imageName = 'computers.png'
		WHERE categoryName = 'МОТОРЧЕТА, МАШИНКИ И МЕХАНИЗМИ' 

	UPDATE Categories 
	SET 
		imageName = 'interior.png'
		WHERE categoryName = 'ВЪТРЕШНО ОБОРУДВАНЕ'

	UPDATE Categories 
	SET 
		imageName = 'computers.png'
		WHERE categoryName = 'КОМПЮТРИ, МОДУЛИ и РЕЛЕТА'

	UPDATE Categories 
	SET 
		imageName = 'filter.png'
		WHERE categoryName = 'АУДИО, ВИДЕО, НАВИГАЦИИ и ДРУГИ'

	UPDATE Categories 
	SET 
		imageName = 'filter.png'
		WHERE categoryName = 'БРАВИ, ДРЪЖКИ, КЛЮЧАЛКИ'

	UPDATE Categories 
	SET 
		imageName = 'filter.png'
		WHERE categoryName = 'КАЗАНЧЕТА, КАПАЧКИ, ЩЕКИ'

	UPDATE Categories 
	SET 
		imageName = 'filter.png'
		WHERE categoryName = 'ЧАСТИ ПО КУПЕТО - ЕДРОГАБАРИТНИ'

	UPDATE Categories 
	SET 
		imageName = 'filter.png'
		WHERE categoryName = 'ЧАСТИ ПО КУПЕТО - МАЛОГАБАРИТНИ'


		
RETURN 0
