using Models.Helper;
using Models.Models;
using Rado.Enums;
using Rado.Models;
using System.ComponentModel.Design;
using System.Text.Json.Serialization;

namespace Models.Enums
{
    public class DisplayPartView
    {
        public long id { get; set; }
        public ItemType itemType { get; set; }
        public bool isCar { get; set; }
        [JsonIgnore()]
        public PartView part { get; set; }
        [JsonIgnore()]
        public RimWithTyreView rimWithTyre { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string mainPicture { get; set; }
        public string description { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public decimal price { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string sellerName { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string sellerPhone { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string sellerPhone2 { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string sellerViber { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string sellerWhats { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string sellerLogo { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string sellerCity { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string sellerCompanyName { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string sellerWebPage { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int numberImages { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int userId { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public ImageData mainImageData { get; set; }
        [JsonIgnore()]
        public int regionId { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public long mainImageId { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)] 
        public ImageData[] images { get; set; }
        [JsonIgnore()]
        public int approved { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int Count { get; set; }
        public UserType dealer { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public long modifiedTime { get; set; }
        [JsonIgnore()]
        public string engineTypeDesc { get; set; }
        [JsonIgnore()]
        public string positionDesc { get; set; }
        [JsonIgnore()]
        public string gearboxDesc { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string ItemTypeStr { get; set; }
        [JsonIgnore()]
        public string RegionStr { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string descriptionModel { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Dictionary<string, string> Tags { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Dictionary<string, string> RimTags { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Dictionary<string, string> TyreTags { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string companyName { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string modelName { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string modificationName { get; set; }


        public DisplayPartView Normalize()
        {
            Tags = new Dictionary<string, string>();
            switch(itemType)
            {
                case ItemType.CarPart:
                case ItemType.BusPart:
                    {
                        NormalizePart(); break;
                    }
                case ItemType.OnlyBus:
                case ItemType.OnlyCar:
                    {
                        NormalizeCar(); break;
                    }
                case ItemType.Tyre:
                    {
                        NormalizeTyre(); break; 
                    }
                case ItemType.Rim:
                    {
                        NormalizeRim(); break;
                    }
                case ItemType.RimWithTyre:
                    {
                        NormalizeRimWithTyre(); break;  
                    }
            }

            return this;
        }

        private string GetPosition() {
            part.frontBackPosition = part.frontBackPosition ?? 0;
            part.leftRightPosition = part.leftRightPosition ?? 0;

            if (part.frontBackPosition == (int)PositionFB.None && part.leftRightPosition == (int)PositionLR.None)
            {
                return "";
            }

            string positionDesc = "";

            if (part.frontBackPosition != 0)
            {
                positionDesc = ConverterToString.FrontBackStr((PositionFB)part.frontBackPosition);
            }

            if (part.leftRightPosition != 0)
            {
                positionDesc += ConverterToString.LeftRightStr((PositionLR)part.leftRightPosition);
            }

            return positionDesc;
        }
        
        public void NormalizePart()
        {
            NormalizePartCar();
            NormalzeCommon();
        }
        public void NormalizeCar()
        {
            NormalizePartCar();
            NormalzeCommon();
        }
        public void NormalizeTyre(bool only = true)
        {
            TyreTags = new Dictionary<string, string>();
            string tyreWidth = "", tyreHeight = "", tyreRadius = "";
            if (ConverterToString.TyreWidthString(rimWithTyre.tyreWidth) != string.Empty)
            {
                tyreWidth = ConverterToString.TyreWidthString(rimWithTyre.tyreWidth);
                TyreTags.Add("Широчина", tyreWidth);
            }


            if (ConverterToString.TyreHeightString(rimWithTyre.tyreHeight) != string.Empty)
            {
                tyreHeight = ConverterToString.TyreHeightString(rimWithTyre.tyreHeight);
                TyreTags.Add("Височина", tyreHeight);
            }

            if (ConverterToString.TyreRadiusString(rimWithTyre.tyreRadius) != string.Empty)
            {
                tyreRadius = ConverterToString.TyreRadiusString(rimWithTyre.tyreRadius);
                TyreTags.Add("Радиус", tyreRadius);
            }

            if (tyreWidth.Length > 0 && tyreHeight.Length > 0 && tyreRadius.Length > 0)
                TyreTags.Add("Размер", $"{tyreWidth}/{tyreHeight}R{tyreRadius}");

            if (ConverterToString.TyreTypeString(rimWithTyre.tyreType) != string.Empty)
                TyreTags.Add("Вид", ConverterToString.TyreTypeString(rimWithTyre.tyreType));

            if (rimWithTyre.monthDOT != null && rimWithTyre.monthDOT !=0 && 
                rimWithTyre.yearDOT != null && rimWithTyre.yearDOT != 0)
            {
                string year = rimWithTyre.yearDOT.Value.ToString("D2");
                string month = rimWithTyre.monthDOT.Value.ToString("D2");
                TyreTags.Add("DOT", $"{month}{year}");
            }

            if (ConverterToString.TyreProducersString(rimWithTyre.tyreCompanyId) != string.Empty)
                TyreTags.Add("Производител", ConverterToString.TyreProducersString(rimWithTyre.tyreCompanyId));

            if (rimWithTyre.count != 0)
                TyreTags.Add("Брой", $"{rimWithTyre.count}");

            if (only)
                NormalzeCommon();
        }
        public void NormalizeRim(bool only = true)
        {
            RimTags = new Dictionary<string, string>();

            if (ConverterToString.RimWidthString(rimWithTyre.rimWidth) != string.Empty)
                RimTags.Add("Щирочина", ConverterToString.RimWidthString(rimWithTyre.rimWidth));

            if (ConverterToString.RimMaterialString(rimWithTyre.rimMaterial) != string.Empty)
                RimTags.Add("Материал", ConverterToString.RimMaterialString(rimWithTyre.rimMaterial));

            if (rimWithTyre.rimCenter != null && rimWithTyre.rimCenter.Value != 0 && 
                ConverterToString.RimCenterString(rimWithTyre.rimCenter.Value) != string.Empty)
                RimTags.Add("Център", ConverterToString.RimCenterString(rimWithTyre.rimCenter.Value));

            if (rimWithTyre.rimOffset != null && ConverterToString.RimOffsetString(rimWithTyre.rimOffset.Value) != string.Empty)
                RimTags.Add("Офсет", ConverterToString.RimOffsetString(rimWithTyre.rimOffset.Value));

            if (rimWithTyre.rimBoltCount != null && ConverterToString.RimBoltCountString(rimWithTyre.rimBoltCount.Value) != string.Empty)
                RimTags.Add("Брой болтове", ConverterToString.RimBoltCountString(rimWithTyre.rimBoltCount.Value));

            if (rimWithTyre.rimBoltDistance != null && ConverterToString.RimBoltDistanceString(rimWithTyre.rimBoltDistance.Value) != string.Empty)
                RimTags.Add("Болт разстояние", ConverterToString.RimBoltDistanceString(rimWithTyre.rimBoltDistance.Value));

            if (rimWithTyre.rimBoltDistance != null && ConverterToString.BoltDistanceString(rimWithTyre.rimBoltDistance.Value) != string.Empty)
                RimTags.Add("Болт дистанция", ConverterToString.BoltDistanceString(rimWithTyre.rimBoltDistance.Value));

            if (only)
                NormalzeCommon();
        }
        public void NormalizeRimWithTyre()
        {
            NormalizeRim(false);
            NormalizeTyre(false);
            NormalzeCommon();
        }

        public void NormalizePartCar()
        {
            if (part.engineType != null && part.engineType.Value != 0)
                engineTypeDesc = ConverterToString.EngineTypeStr(part.engineType.Value);
            if (part.gearboxType != null && part.gearboxType.Value != 0)
                gearboxDesc = ConverterToString.GearboxTypeStr(part.gearboxType.Value);
            if (part.gearboxType != null && part.gearboxType.Value != 0 && ConverterToString.GearboxTypeStr(part.gearboxType.Value) != string.Empty)
                Tags.Add("Скоростна кутия", ConverterToString.GearboxTypeStr(part.gearboxType.Value));

            if (part.engineType != null && part.engineType.Value != 0 && ConverterToString.EngineTypeStr(part.engineType.Value) != string.Empty)
                Tags.Add("Вид двигател", ConverterToString.EngineTypeStr(part.engineType.Value));
            if (part.engineModel.Length > 0)
                Tags.Add("Код двигател", $"Код двигател:{part.engineModel}");

            if (!part.isCar)
            {
                positionDesc = GetPosition();
                if (positionDesc != string.Empty)
                    Tags.Add("Позиция", $"Позиция {positionDesc}");
            }
            if (part.powerkWh != null && part.powerkWh != 0)
                Tags.Add("Мощност", $"{part.powerkWh}KW/{part.powerBHP}BHP ");
            if (part.vin?.Length > 0)
                Tags.Add("VIN", $"{part.vin}");
            if ((itemType == ItemType.BusPart || itemType == ItemType.CarPart)  && part.partNumber.Length > 0 )
                Tags.Add("Номер на частта", $"Номер на частта: {part.partNumber}");
            if (part.millage != 0)
                Tags.Add("Пробег", $"{part.millage} км");


        }
        public void NormalzeCommon()
        {
            if (itemType == ItemType.CarPart || itemType == ItemType.BusPart || itemType == ItemType.OnlyBus || itemType == ItemType.OnlyCar) {
                if (itemType == ItemType.OnlyCar)
                    descriptionModel = $"Колa на части - {part.companyName} {part.modelName}    {part.modificationName}";
                else if (itemType == ItemType.OnlyBus)
                    descriptionModel = $"Бус на части - {part.companyName} {part.modelName}";
                else
                {
                    descriptionModel = $"{part.dealerSubCategoryName} за {part.companyName} {part.modelName} {part.modificationName}";
                }
            } 
            else
            {
                if (itemType == ItemType.Rim)
                {
                    descriptionModel = "Джанта";
                }
                else if (itemType == ItemType.Tyre)
                {
                    descriptionModel = "Гума";
                }
                else if (itemType == ItemType.RimWithTyre)
                {
                    descriptionModel = "Гума с джанта";
                }
            }

            if (mainPicture == null)
                mainPicture = "assets/NoImage.jpg";

            if (ConverterToString.RegionString(regionId) != string.Empty)
                Tags.TryAdd("Регион", ConverterToString.RegionString(regionId));

            if (description.Length > 0)
                Tags.Add("Описание", $"{description}");
        }
    }
}
