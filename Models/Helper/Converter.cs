using Microsoft.VisualBasic;
using Rado.Models;
using Rado;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Rado.Enums;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Models.Enums;

namespace Models.Helper
{
    public class ConverterToString
    {
        public static Dictionary<PositionLR, string> LeftRight = new Dictionary<PositionLR, string> {
            { PositionLR.None, "Без значение" },
            { PositionLR.Left, "Ляво" },
            { PositionLR.Right, "Дясно" }
    };

        public static Dictionary<PositionFB, string> FrontBack = new Dictionary<PositionFB, string> {
            { PositionFB.None, "Без значение" },
            { PositionFB.Front, "Предно" },
            { PositionFB.Back, "Задно" },
    };

        public static Dictionary<int, string> EngineType = new Dictionary<int, string> {
            { 0, "Без значение" },
            { 1, "Бензин" },
            { 2, "Дизел" },
            { 3, "Хибрид" },
            { 4, "Газ" },
            { 5, "Елекрически" },
            { 6, "Plug-in хибрид" },
    };

        public static Dictionary<int, string> GearboxType = new Dictionary<int, string> {
            { 0, "Без значение" },
            { 1, "Ръчна" },
            { 2, "Автоматична" },
            { 3, "Полуавтоматична" }
    };

        public static Dictionary<int, string> TyreProducers = new()
        {
            { 1, "Accelera" },
            { 2, "Achilles" },
            { 3, "Admiral" },
            { 4, "Alliance" },
            { 5, "America" },
            { 6, "Atturo" },
            { 7, "Autogrip" },
            { 8, "Avon" },
            { 9, "BCT" },
            { 10, "BF Goodrich" },
            { 11, "Barum" },
            { 151, "Belshina" },
            { 12, "Bridgestone" },
            { 13, "Capitol" },
            { 14, "Ceat" },
            { 15, "Clear" },
            { 16, "Continental" },
            { 17, "Cooper" },
            { 149, "DMACK" },
            { 157, "Davanti" },
            { 18, "Dayton" },
            { 19, "Debica" },
            { 20, "Delinte" },
            { 21, "Dextero" },
            { 22, "Dunlop" },
            { 23, "Duro" },
            { 24, "Durun" },
            { 155, "Dоuble Coin" },
            { 25, "Effiplus" },
            { 150, "Esa Tecar" },
            { 26, "Eurostone" },
            { 27, "Falken" },
            { 28, "Federal" },
            { 152, "Fedima" },
            { 29, "Firestone" },
            { 30, "Fortuna" },
            { 31, "Fulda" },
            { 32, "Fullway" },
            { 33, "GT Radial" },
            { 34, "General" },
            { 35, "Gislaved" },
            { 36, "GoldenTyre" },
            { 37, "Goodride" },
            { 38, "Goodyear" },
            { 39, "Gremax" },
            { 40, "HI FLY" },
            { 41, "Haida" },
            { 42, "Hankook" },
            { 153, "Hercules" },
            { 43, "Hero" },
            { 44, "High Performer" },
            { 45, "Infinity" },
            { 46, "Insa Turbo" },
            { 47, "Interco" },
            { 48, "Interstate" },
            { 49, "Kelly" },
            { 50, "Kenda" },
            { 51, "Kinforest" },
            { 52, "King Meiler" },
            { 53, "Kings Tire" },
            { 54, "Kingstar" },
            { 55, "Kleber" },
            { 56, "Kormoran" },
            { 57, "Kumho" },
            { 58, "Lassa" },
            { 59, "Lexani" },
            { 60, "Linglong" },
            { 61, "Maloya" },
            { 62, "Marangoni" },
            { 63, "Marix" },
            { 64, "Marshal" },
            { 65, "Mastersteel" },
            { 66, "Matador" },
            { 67, "Maxtrek" },
            { 68, "Maxxis" },
            { 69, "Meteor" },
            { 70, "Michelin" },
            { 71, "Mickey Thompson" },
            { 72, "Minerva" },
            { 73, "Nankang" },
            { 74, "Nexen" },
            { 75, "Nokian" },
            { 76, "Novex" },
            { 77, "Pace" },
            { 78, "Petlas" },
            { 79, "Pirelli" },
            { 80, "Pneumant" },
            { 154, "PowerTrac" },
            { 81, "Recip" },
            { 82, "Regal" },
            { 83, "Riken" },
            { 84, "Roadstone" },
            { 85, "Rockstone" },
            { 86, "Rotalla" },
            { 87, "Rotex" },
            { 88, "Runway" },
            { 89, "Sailun" },
            { 90, "Sava" },
            { 91, "Semperit" },
            { 92, "Silverstone" },
            { 93, "Sonny" },
            { 94, "Star" },
            { 95, "Star Performer" },
            { 96, "Starco" },
            { 97, "Starfire" },
            { 98, "Starmaxx" },
            { 99, "Stunner" },
            { 100, "Sunew" },
            { 101, "Sunny" },
            { 148, "Syron" },
            { 102, "Tigar" },
            { 103, "Toyo" },
            { 104, "Trayal" },
            { 105, "Triangle" },
            { 106, "Tyfoon" },
            { 107, "Uniroyal" },
            { 108, "VSP" },
            { 109, "Viking" },
            { 110, "Vredestein" },
            { 111, "Wanli" },
            { 112, "Westlake" },
            { 113, "Winter Tact" },
            { 114, "Yokohama" },
            { 115, "Zeetex" },
            { 116, "Zetum" },
            { 147, "Други" }
        };

        public static Dictionary<int, string> TyreWidth = new()
        {
            { 18, "155" },
            { 20, "165" },
            { 22, "175" },
            { 24, "185" },
            { 26, "195" },
            { 28, "205" },
            { 30, "215" },
            { 32, "225" },
            { 1, "70" },
            { 2, "75" },
            { 3, "80" },
            { 4, "85" },
            { 5, "90" },
            { 6, "95" },
            { 7, "100" },
            { 8, "105" },
            { 9, "110" },
            { 10, "115" },
            { 11, "120" },
            { 12, "125" },
            { 13, "130" },
            { 14, "135" },
            { 15, "140" },
            { 16, "145" },
            { 17, "150" },
            { 19, "160" },
            { 21, "170" },
            { 23, "180" },
            { 25, "190" },
            { 27, "200" },
            { 29, "210" },
            { 31, "220" },
            { 33, "230" },
            { 34, "235" },
            { 35, "240" },
            { 36, "245" },
            { 37, "250" },
            { 38, "255" },
            { 39, "260" },
            { 40, "265" },
            { 41, "270" },
            { 42, "275" },
            { 43, "280" },
            { 44, "285" },
            { 45, "290" },
            { 46, "295" },
            { 47, "300" },
            { 48, "305" },
            { 49, "310" },
            { 50, "315" },
            { 51, "320" },
            { 52, "325" },
            { 53, "330" },
            { 54, "335" },
            { 55, "340" },
            { 56, "345" },
            { 57, "350" },
            { 58, "355" },
            { 59, "360" },
            { 60, "365" },
            { 61, "370" },
            { 62, "375" },
            { 63, "380" },
            { 64, "385" },
            { 65, "390" },
            { 66, "395" },
            { 67, "400" },
            { 68, "405" },
            { 69, "410" },
            { 70, "415" },
            { 71, "420" },
            { 72, "425" },
            { 73, "430" },
            { 74, "435" },
            { 75, "440" },
            { 76, "445" },
            { 77, "450" },
            { 78, "455" },
            { 79, "460" }
        };

        public static Dictionary<int, string> TyreHeight = new() {
            { 1, "25" },
            { 2, "30" },
            { 3, "35" },
            { 4, "40" },
            { 5, "45" },
            { 6, "50" },
            { 7, "55" },
            { 8, "60" },
            { 9, "65" },
            { 10, "75" },
            { 11, "80" },
            { 12, "85" },
            { 13, "90" },
            { 14, "95" },
            { 15, "100" },
            { 16, "105" },
            { 17, "110" },
            { 18, "115" },
            { 19, "120" }
    };

        public static Dictionary<int, string> TyreRadius = new()
        {
            { 6, "15" },
            { 8, "16" },
            { 10, "17" },
            { 12, "18" },
            { 14, "19" },
            { 16, "20" },
            { 1, "10" },
            { 2, "11" },
            { 3, "12" },
            { 4, "13" },
            { 5, "14" },
            { 7, "15.5" },
            { 9, "16.5" },
            { 11, "17.5" },
            { 13, "18.5" },
            { 15, "19.5" },
            { 18, "20.5" },
            { 19, "21" },
            { 20, "21.5" },
            { 21, "22" },
            { 22, "22.5" },
            { 23, "23" },
            { 24, "23.5" },
            { 25, "24" },
            { 26, "24.5" },
            { 27, "25" },
            { 28, "25.5" },
            { 29, "26" },
            { 30, "27" },
            { 31, "27.5" },
            { 32, "28" },
            { 33, "28.5" }
    };

        public static Dictionary<int, string> TyreType = new() {
            { 1, "Летни" },
            { 2, "Зимни" },
            { 3, "Всесезонни" },
    };

        public static Dictionary<int, string> RimWidth = new() {
            { 1, "3.0" },
            { 2, "3.5" },
            { 3, "4.0" },
            { 4, "4.5" },
            { 5, "5.0" },
            { 6, "5.5" },
            { 7, "6.0" },
            { 8, "6.5" },
            { 9, "7.0" },
            { 10, "7.5" },
            { 11, "8.0" },
            { 12, "8.5" },
            { 13, "9.0" },
            { 14, "9.5" },
            { 15, "10.0" },
            { 16, "10.5" },
            { 17, "11.0" },
            { 18, "11.5" },
            { 19, "12.0" },
            { 20, "12.5" },
            { 21, "13.0" },
            { 22, "13.5" },
            { 24, "14.0" }
    };

        public static Dictionary<int, string> RimMaterial = new() {
            { 1, "железни" },
            { 2, "магнезиеви" },
            { 3, "алуминиеви" },
            { 4, "други" },
    };

        public static Dictionary<int, string> BoltDistance = new() {
            { 1, "98" },
            { 2, "100" },
            { 3, "108" },
    };

        public static Dictionary<int, string> RimCenter = new()
        {
            { 1, "8.6" },
            { 2, "10.5" },
            { 3, "11" }
    };

        public static Dictionary<int, string> RimOffset = new() {
            { 1, "-30-20" },
            { 2, "-20-10" },
            { 3, "-10-0" },
            { 4, "0-10" },
            { 5, "10-20" },
            { 6, "20-30" },
            { 7, "30-40" },
            { 8, "40-50" },
            { 9, "50-60" },
            { 10, "60-70" },
            { 11, "70-80" },
            { 12, "80-90" },
            { 13, "90-100" }
    };

        public static Dictionary<int, string> RimBoltCount = new() {
            { 0, "" },
            { 3, "3" },
            { 4, "4" },
            { 5, "5" },
            { 6, "6" },
            { 8, "8" },
            { 9, "9" },
            { 10, "10" },
            { 12, "12" }
    };
        public static Dictionary<int, string> RimBoltDistance = new() {
            { 1, "98" },
            { 2, "103" },
            { 3, "111" }
    };


        public static Dictionary<ItemType, string> ItemTypes = new Dictionary<ItemType, string>()  {
                { ItemType.None, "Всички"},
                { ItemType.Tyre, "Гума"},
                { ItemType.Rim, "Джанта"},
                { ItemType.RimWithTyre, "Гума с джанта"},
                { ItemType.AllCarAndPart, "Коли и части"},
                { ItemType.AllTyre, "Гуми, джанти и гуми с джанти"},
                { ItemType.AllBusAndPart, "Bus"},
                { ItemType.BusPart, "Част за бус"},
                { ItemType.CarPart, "Част за кола"},
                { ItemType.OnlyCar, "Кола на части"},
                { ItemType.OnlyBus, "Бус на части"},
            };

        public static Dictionary<int, string> Region = new Dictionary<int, string>()
            {
                { 1, "Благоевград" },
                { 2, "Бургас" },
                { 3, "Варна" },
                { 4, "Велико Търново" },
                { 5, "Видин" },
                { 6, "Враца" },
                { 7, "Габрово" },
                { 8, "Добрич" },
                { 9, "Дупница" },
                { 10, "Кърджали" },
                { 11, "Кюстендил" },
                { 12, "Ловеч" },
                { 13, "Монтана" },
                { 14, "Пазарджик" },
                { 15, "Перник" },
                { 16, "Плевен" },
                { 17, "Пловдив" },
                { 18, "Разград" },
                { 19, "Русе" },
                { 20, "Силистра" },
                { 21, "Сливен" },
                { 22, "Смолян" },
                { 23, "София" },
                { 24, "София Област" },
                { 25, "Стара Загора" },
                { 26, "Търговище" },
                { 27, "Хасково" },
                { 28, "Шумен" },
                { 29, "Ямбол" },
                { 30, "Извън страната" }
            };


        public static string LeftRightStr(PositionLR leftRight)
        {
            if (LeftRight.ContainsKey(leftRight))
                return LeftRight[leftRight];
            else
                return string.Empty;
        }
        
        public static string FrontBackStr(PositionFB frontBack)
        {
            if (FrontBack.ContainsKey(frontBack))
                return FrontBack[frontBack];
            else
                return string.Empty;
        }
        
        public static string EngineTypeStr(int engineType)
        {
            if (EngineType.ContainsKey(engineType))
                return EngineType[engineType];
            else
                return string.Empty;
        }
        public static string GearboxTypeStr(int gearboxType)
        {
            if (GearboxType.ContainsKey(gearboxType))
                return GearboxType[gearboxType];
            else
                return string.Empty;
        }
        
        public static string ItemTypeStr(ItemType itemType)
        {
            if (ItemTypes.ContainsKey(itemType))
                return ItemTypes[itemType];
            else
                return string.Empty;
        }
        public static string RegionString(int regionId)
        {
            if (Region.ContainsKey(regionId))
                return Region[regionId];
            else
                return string.Empty;
        }

        public static string TyreProducersString(int tyreProducerId)
        {
            if (TyreProducers.ContainsKey(tyreProducerId))
                return TyreProducers[tyreProducerId];
            return
                string.Empty;
        }

        public static string TyreWidthString(int tyreWidthId)
        {
            if (TyreWidth.ContainsKey(tyreWidthId))
                return TyreWidth[tyreWidthId];
            return
                string.Empty;
        }

        public static string TyreHeightString(int tyreHeightId)
        {
            if (TyreHeight.ContainsKey(tyreHeightId))
                return TyreHeight[tyreHeightId];
            else
                return string.Empty;
        }

        public static string TyreRadiusString(int tyreRadiusId)
        {
            if (TyreRadius.ContainsKey(tyreRadiusId))
                return TyreRadius[tyreRadiusId];
            else
                return string.Empty;
        }

        public static string TyreTypeString(int tyreTypeId)
        {
            if (TyreType.ContainsKey(tyreTypeId))
                return TyreType[tyreTypeId];
            else
                return string.Empty;
        }

        public static string RimWidthString(int RimWidthId)
        {
            if (RimWidth.ContainsKey(RimWidthId))
                return RimWidth[RimWidthId];
            else
                return string.Empty;
        }

        public static string RimMaterialString(int RimMaterialId)
        {
            if (RimMaterial.ContainsKey(RimMaterialId))
                return RimMaterial[RimMaterialId];
            else
                return string.Empty;
        }
        public static string BoltDistanceString(int boltDistanceId)
        {
            if (BoltDistance.ContainsKey(boltDistanceId))
                return BoltDistance[boltDistanceId];
            else
                return string.Empty;
        }
        public static string RimCenterString(int RimCenterId)
        {
            if (RimCenter.ContainsKey(RimCenterId))
                return RimCenter[RimCenterId];
            else
                return string.Empty;
        }
        public static string RimOffsetString(int RimOffsetId)
        {
            if (RimOffset.ContainsKey(RimOffsetId))
                return RimOffset[RimOffsetId];
            else
                return string.Empty;
        }
        public static string RimBoltCountString(int RimBoltCountId)
        {
            if (RimBoltCount.ContainsKey(RimBoltCountId))
                return RimBoltCount[RimBoltCountId];
            else
                return string.Empty;
        }

        public static string RimBoltDistanceString(int RimBoltDistanceId)
        {
            if (RimBoltDistance.ContainsKey(RimBoltDistanceId))
                return RimBoltDistance[RimBoltDistanceId];
            else
                return string.Empty;
        }
       }
}
