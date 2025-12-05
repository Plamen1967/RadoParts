import { Injectable } from '@angular/core'
import { SortType } from '@model/enum/sortType.enum'
import { SelectOption } from '@model/selectOption'

@Injectable({
    providedIn: 'root',
})
export class StaticSelectionService {
    public get LeftRight(): SelectOption[] {
        return [
            { value: 0, text: 'Без значение' },
            { value: 1, text: 'Ляво' },
            { value: 2, text: 'Ляво' },
        ]
    }

    public get FrontBack(): SelectOption[] {
        return [
            { value: 0, text: 'Без значение' },
            { value: 1, text: 'Предно' },
            { value: 2, text: 'Задно' },
        ]
    }

    public get EngineType(): SelectOption[] {
        return [
            { value: 0, text: 'Без значение' },
            { value: 1, text: 'Бензин' },
            { value: 2, text: 'Дизел' },
            { value: 3, text: 'Хибрид' },
            { value: 4, text: 'Газ' },
            { value: 5, text: 'Елекрически' },
            { value: 6, text: 'Plug-in хибрид' },
        ]
    }

    public get GearboxType(): SelectOption[] {
        return [
            { value: 0, text: 'Без значение' },
            { value: 1, text: 'Ръчна' },
            { value: 2, text: 'Автоматична' },
            { value: 3, text: 'Полуавтоматична' },
        ]
    }

    public get Region(): SelectOption[] {
        return [
            { value: 1, text: 'Благоевград' },
            { value: 2, text: 'Бургас' },
            { value: 3, text: 'Варна' },
            { value: 4, text: 'Велико Търново' },
            { value: 5, text: 'Видин' },
            { value: 6, text: 'Враца' },
            { value: 7, text: 'Габрово' },
            { value: 8, text: 'Добрич' },
            { value: 9, text: 'Дупница' },
            { value: 10, text: 'Кърджали' },
            { value: 11, text: 'Кюстендил' },
            { value: 12, text: 'Ловеч' },
            { value: 13, text: 'Монтана' },
            { value: 14, text: 'Пазарджик' },
            { value: 15, text: 'Перник' },
            { value: 16, text: 'Плевен' },
            { value: 17, text: 'Пловдив' },
            { value: 18, text: 'Разград' },
            { value: 19, text: 'Русе' },
            { value: 20, text: 'Силистра' },
            { value: 21, text: 'Сливен' },
            { value: 22, text: 'Смолян' },
            { value: 23, text: 'София' },
            { value: 24, text: 'София Област' },
            { value: 25, text: 'Стара Загора' },
            { value: 26, text: 'Търговище' },
            { value: 27, text: 'Хасково' },
            { value: 28, text: 'Шумен' },
            { value: 29, text: 'Ямбол' },
            { value: 30, text: 'Извън страната' },
        ]
    }

    public get Sort(): SelectOption[] {
        return [
            { value: SortType.PriceAsc, text: ' Цена' },
            { value: SortType.YearDesc, text: ' Година' },
            { value: SortType.modifiedTimeDesc, text: ' Най-нови обяви' },
        ]
    }
    // public get Sort() : SelectOption[] {
    //   return [
    //     { value : 0, text: "↑ Цена" },
    //     { value : 1, text: "↓ Цена" },
    //     { value : 4, text: "↑ Част номер" },
    //     { value : 5, text: "↓ Част номер" },
    //     { value : 6, text: "↑ Година" },
    //     { value : 7, text: "↓ Година" },
    //     { value : 8, text: "↑ Дата на добавяне" },
    //     { value : 9, text: "↓ Дата на добавяне" },
    //     { value : 10, text: "↑ Мощност К.С." },
    //     { value : 11, text: "↓ Мощност К.С." },
    //   ]
    // }

    public get Years(): SelectOption[] {
        const returnValue: SelectOption[] = []
        const date = new Date()
        const year = date.getFullYear()
        for (let i = 1970; i <= year; i++) {
            returnValue.push({ value: i, text: i.toString() })
        }

        return returnValue
    }

    public engineTypeDescription(engineType: number) {
        return this.EngineType.find((x) => x.value === engineType)?.text
    }

    public readonly maxNumberParts = 3

    public get timeToShowMessage(): number {
        return 2 * 1000
    }

    public get TyreProducers(): SelectOption[] {
        return [
            { value: 1, text: 'Accelera' },
            { value: 2, text: 'Achilles' },
            { value: 3, text: 'Admiral' },
            { value: 4, text: 'Alliance' },
            { value: 5, text: 'America' },
            { value: 6, text: 'Atturo' },
            { value: 7, text: 'Autogrip' },
            { value: 8, text: 'Avon' },
            { value: 9, text: 'BCT' },
            { value: 10, text: 'BF Goodrich' },
            { value: 11, text: 'Barum' },
            { value: 151, text: 'Belshina' },
            { value: 12, text: 'Bridgestone' },
            { value: 13, text: 'Capitol' },
            { value: 14, text: 'Ceat' },
            { value: 15, text: 'Clear' },
            { value: 16, text: 'Continental' },
            { value: 17, text: 'Cooper' },
            { value: 149, text: 'DMACK' },
            { value: 157, text: 'Davanti' },
            { value: 18, text: 'Dayton' },
            { value: 19, text: 'Debica' },
            { value: 20, text: 'Delinte' },
            { value: 21, text: 'Dextero' },
            { value: 22, text: 'Dunlop' },
            { value: 23, text: 'Duro' },
            { value: 24, text: 'Durun' },
            { value: 155, text: 'Dоuble Coin' },
            { value: 25, text: 'Effiplus' },
            { value: 150, text: 'Esa Tecar' },
            { value: 26, text: 'Eurostone' },
            { value: 27, text: 'Falken' },
            { value: 28, text: 'Federal' },
            { value: 152, text: 'Fedima' },
            { value: 29, text: 'Firestone' },
            { value: 30, text: 'Fortuna' },
            { value: 31, text: 'Fulda' },
            { value: 32, text: 'Fullway' },
            { value: 33, text: 'GT Radial' },
            { value: 34, text: 'General' },
            { value: 35, text: 'Gislaved' },
            { value: 36, text: 'GoldenTyre' },
            { value: 37, text: 'Goodride' },
            { value: 38, text: 'Goodyear' },
            { value: 39, text: 'Gremax' },
            { value: 40, text: 'HI FLY' },
            { value: 41, text: 'Haida' },
            { value: 42, text: 'Hankook' },
            { value: 153, text: 'Hercules' },
            { value: 43, text: 'Hero' },
            { value: 44, text: 'High Performer' },
            { value: 45, text: 'Infinity' },
            { value: 46, text: 'Insa Turbo' },
            { value: 47, text: 'Interco' },
            { value: 48, text: 'Interstate' },
            { value: 49, text: 'Kelly' },
            { value: 50, text: 'Kenda' },
            { value: 51, text: 'Kinforest' },
            { value: 52, text: 'King Meiler' },
            { value: 53, text: 'Kings Tire' },
            { value: 54, text: 'Kingstar' },
            { value: 55, text: 'Kleber' },
            { value: 56, text: 'Kormoran' },
            { value: 57, text: 'Kumho' },
            { value: 58, text: 'Lassa' },
            { value: 59, text: 'Lexani' },
            { value: 60, text: 'Linglong' },
            { value: 61, text: 'Maloya' },
            { value: 62, text: 'Marangoni' },
            { value: 63, text: 'Marix' },
            { value: 64, text: 'Marshal' },
            { value: 65, text: 'Mastersteel' },
            { value: 66, text: 'Matador' },
            { value: 67, text: 'Maxtrek' },
            { value: 68, text: 'Maxxis' },
            { value: 69, text: 'Meteor' },
            { value: 70, text: 'Michelin' },
            { value: 71, text: 'Mickey Thompson' },
            { value: 72, text: 'Minerva' },
            { value: 73, text: 'Nankang' },
            { value: 74, text: 'Nexen' },
            { value: 75, text: 'Nokian' },
            { value: 76, text: 'Novex' },
            { value: 77, text: 'Pace' },
            { value: 78, text: 'Petlas' },
            { value: 79, text: 'Pirelli' },
            { value: 80, text: 'Pneumant' },
            { value: 154, text: 'PowerTrac' },
            { value: 81, text: 'Recip' },
            { value: 82, text: 'Regal' },
            { value: 83, text: 'Riken' },
            { value: 84, text: 'Roadstone' },
            { value: 85, text: 'Rockstone' },
            { value: 86, text: 'Rotalla' },
            { value: 87, text: 'Rotex' },
            { value: 88, text: 'Runway' },
            { value: 89, text: 'Sailun' },
            { value: 90, text: 'Sava' },
            { value: 91, text: 'Semperit' },
            { value: 92, text: 'Silverstone' },
            { value: 93, text: 'Sonny' },
            { value: 94, text: 'Star' },
            { value: 95, text: 'Star Performer' },
            { value: 96, text: 'Starco' },
            { value: 97, text: 'Starfire' },
            { value: 98, text: 'Starmaxx' },
            { value: 99, text: 'Stunner' },
            { value: 100, text: 'Sunew' },
            { value: 101, text: 'Sunny' },
            { value: 148, text: 'Syron' },
            { value: 102, text: 'Tigar' },
            { value: 103, text: 'Toyo' },
            { value: 104, text: 'Trayal' },
            { value: 105, text: 'Triangle' },
            { value: 106, text: 'Tyfoon' },
            { value: 107, text: 'Uniroyal' },
            { value: 108, text: 'VSP' },
            { value: 109, text: 'Viking' },
            { value: 110, text: 'Vredestein' },
            { value: 111, text: 'Wanli' },
            { value: 112, text: 'Westlake' },
            { value: 113, text: 'Winter Tact' },
            { value: 114, text: 'Yokohama' },
            { value: 115, text: 'Zeetex' },
            { value: 116, text: 'Zetum' },
            { value: 147, text: 'Други' },
        ]
    }

    public get TyreWidth(): SelectOption[] {
        return [
            { value: 18, text: '155' },
            { value: 20, text: '165' },
            { value: 22, text: '175' },
            { value: 24, text: '185' },
            { value: 26, text: '195' },
            { value: 28, text: '205' },
            { value: 30, text: '215' },
            { value: 32, text: '225' },
            { value: 1, text: '70' },
            { value: 2, text: '75' },
            { value: 3, text: '80' },
            { value: 4, text: '85' },
            { value: 5, text: '90' },
            { value: 6, text: '95' },
            { value: 7, text: '100' },
            { value: 8, text: '105' },
            { value: 9, text: '110' },
            { value: 10, text: '115' },
            { value: 11, text: '120' },
            { value: 12, text: '125' },
            { value: 13, text: '130' },
            { value: 14, text: '135' },
            { value: 15, text: '140' },
            { value: 16, text: '145' },
            { value: 17, text: '150' },
            { value: 19, text: '160' },
            { value: 21, text: '170' },
            { value: 23, text: '180' },
            { value: 25, text: '190' },
            { value: 27, text: '200' },
            { value: 29, text: '210' },
            { value: 31, text: '220' },
            { value: 33, text: '230' },
            { value: 34, text: '235' },
            { value: 35, text: '240' },
            { value: 36, text: '245' },
            { value: 37, text: '250' },
            { value: 38, text: '255' },
            { value: 39, text: '260' },
            { value: 40, text: '265' },
            { value: 41, text: '270' },
            { value: 42, text: '275' },
            { value: 43, text: '280' },
            { value: 44, text: '285' },
            { value: 45, text: '290' },
            { value: 46, text: '295' },
            { value: 47, text: '300' },
            { value: 48, text: '305' },
            { value: 49, text: '310' },
            { value: 50, text: '315' },
            { value: 51, text: '320' },
            { value: 52, text: '325' },
            { value: 53, text: '330' },
            { value: 54, text: '335' },
            { value: 55, text: '340' },
            { value: 56, text: '345' },
            { value: 57, text: '350' },
            { value: 58, text: '355' },
            { value: 59, text: '360' },
            { value: 60, text: '365' },
            { value: 61, text: '370' },
            { value: 62, text: '375' },
            { value: 63, text: '380' },
            { value: 64, text: '385' },
            { value: 65, text: '390' },
            { value: 66, text: '395' },
            { value: 67, text: '400' },
            { value: 68, text: '405' },
            { value: 69, text: '410' },
            { value: 70, text: '415' },
            { value: 71, text: '420' },
            { value: 72, text: '425' },
            { value: 73, text: '430' },
            { value: 74, text: '435' },
            { value: 75, text: '440' },
            { value: 76, text: '445' },
            { value: 77, text: '450' },
            { value: 78, text: '455' },
            { value: 79, text: '460' },
        ]
    }

    public get TyreHeight(): SelectOption[] {
        return [
            { value: 1, text: '25' },
            { value: 2, text: '30' },
            { value: 3, text: '35' },
            { value: 4, text: '40' },
            { value: 5, text: '45' },
            { value: 6, text: '50' },
            { value: 7, text: '55' },
            { value: 8, text: '60' },
            { value: 9, text: '65' },
            { value: 10, text: '75' },
            { value: 11, text: '80' },
            { value: 12, text: '85' },
            { value: 13, text: '90' },
            { value: 14, text: '95' },
            { value: 15, text: '100' },
            { value: 16, text: '105' },
            { value: 17, text: '110' },
            { value: 18, text: '115' },
            { value: 19, text: '120' },
        ]
    }

    public get TyreRadius(): SelectOption[] {
        return [
            { value: 6, text: '15' },
            { value: 8, text: '16' },
            { value: 10, text: '17' },
            { value: 12, text: '18' },
            { value: 14, text: '19' },
            { value: 16, text: '20' },
            { value: 1, text: '10' },
            { value: 2, text: '11' },
            { value: 3, text: '12' },
            { value: 4, text: '13' },
            { value: 5, text: '14' },
            { value: 7, text: '15.5' },
            { value: 9, text: '16.5' },
            { value: 11, text: '17.5' },
            { value: 13, text: '18.5' },
            { value: 15, text: '19.5' },
            { value: 18, text: '20.5' },
            { value: 19, text: '21' },
            { value: 20, text: '21.5' },
            { value: 21, text: '22' },
            { value: 22, text: '22.5' },
            { value: 23, text: '23' },
            { value: 24, text: '23.5' },
            { value: 25, text: '24' },
            { value: 26, text: '24.5' },
            { value: 27, text: '25' },
            { value: 28, text: '25.5' },
            { value: 29, text: '26' },
            { value: 30, text: '27' },
            { value: 31, text: '27.5' },
            { value: 32, text: '28' },
            { value: 33, text: '28.5' },
        ]
    }

    public get TyreType(): SelectOption[] {
        return [
            { value: 1, text: 'Летни' },
            { value: 2, text: 'Зимни' },
            { value: 3, text: 'Всесезонни' },
        ]
    }

    public get RimWidth(): SelectOption[] {
        return [
            { value: 1, text: '3.0' },
            { value: 2, text: '3.5' },
            { value: 3, text: '4.0' },
            { value: 4, text: '4.5' },
            { value: 5, text: '5.0' },
            { value: 6, text: '5.5' },
            { value: 7, text: '6.0' },
            { value: 8, text: '6.5' },
            { value: 9, text: '7.0' },
            { value: 10, text: '7.5' },
            { value: 11, text: '8.0' },
            { value: 12, text: '8.5' },
            { value: 13, text: '9.0' },
            { value: 14, text: '9.5' },
            { value: 15, text: '10.0' },
            { value: 16, text: '10.5' },
            { value: 17, text: '11.0' },
            { value: 18, text: '11.5' },
            { value: 19, text: '12.0' },
            { value: 20, text: '12.5' },
            { value: 21, text: '13.0' },
            { value: 22, text: '13.5' },
            { value: 24, text: '14.0' },
        ]
    }

    public get RimMaterial(): SelectOption[] {
        return [
            { value: 1, text: 'железни' },
            { value: 2, text: 'магнезиеви' },
            { value: 3, text: 'алуминиеви' },
            { value: 4, text: 'други' },
        ]
    }

    public get BoltDistance(): SelectOption[] {
        return [
            { value: 1, text: '98' },
            { value: 2, text: '100' },
            { value: 3, text: '108' },
        ]
    }

    public get RimCenter(): SelectOption[] {
        return [
            { value: 1, text: '8.6' },
            { value: 2, text: '10.5' },
            { value: 3, text: '11' },
        ]
    }

    public get RimOffset(): SelectOption[] {
        return [
            { value: 1, text: '-30-20' },
            { value: 2, text: '-20-10' },
            { value: 3, text: '-10-0' },
            { value: 4, text: '0-10' },
            { value: 5, text: '10-20' },
            { value: 6, text: '20-30' },
            { value: 7, text: '30-40' },
            { value: 8, text: '40-50' },
            { value: 9, text: '50-60' },
            { value: 10, text: '60-70' },
            { value: 11, text: '70-80' },
            { value: 12, text: '80-90' },
            { value: 13, text: '90-100' },
        ]
    }

    getRegion(regionId: number) {
        const region = this.Region.find((x) => x.value === regionId)
        if (region?.value != 0) return region?.text ?? ''
        return ''
    }

    public get RimBoltCount(): SelectOption[] {
        return [
            { value: undefined, text: '' },
            { value: 3, text: '3' },
            { value: 4, text: '4' },
            { value: 5, text: '5' },
            { value: 6, text: '6' },
            { value: 8, text: '8' },
            { value: 9, text: '9' },
            { value: 10, text: '10' },
            { value: 12, text: '12' },
        ]
    }
    public get RimBoltDistance(): SelectOption[] {
        return [
            { value: 1, text: '98' },
            { value: 2, text: '103' },
            { value: 3, text: '111' },
        ]
    }
}
