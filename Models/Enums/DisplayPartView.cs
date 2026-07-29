using Models.Helper;
using Models.Models;
using Rado.Enums;
using Rado.Models;
using System.Text.Json.Serialization;

namespace Models.Enums
{
    public class DisplayPartView
    {
        public long Id { get; set; }
        public ItemType ItemType { get; set; }
        public bool IsCar { get; set; }
        [JsonIgnore()]
        public PartView Part { get; set; }
        [JsonIgnore()]
        public RimWithTyreView RimWithTyre { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? MainPicture { get; set; }
        public string? Description { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public decimal Price { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string? SellerName { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string? SellerPhone { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string? SellerPhone2 { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? SellerViber { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string? SellerWhats { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string? SellerLogo { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string SellerCity { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string? SellerCompanyName { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public string? SellerWebPage { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int NumberImages { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int UserId { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public ImageDataClass MainImageData { get; set; }
        [JsonIgnore()]
        public int RegionId { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public long MainImageId { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)] 
        public ImageDataClass[] Images { get; set; }
        [JsonIgnore()]
        public int Approved { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public int Count { get; set; }
        public UserType Dealer { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
        public long ModifiedTime { get; set; }
        [JsonIgnore()]
        public string? EngineTypeDesc { get; set; }
        [JsonIgnore()]
        public string? PositionDesc { get; set; }
        [JsonIgnore()]
        public string? GearboxDesc { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? ItemTypeStr { get; set; }
        [JsonIgnore()]
        public string? RegionStr { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? DescriptionModel { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Dictionary<string, string>? Tags { get; set; } = new Dictionary<string, string>();
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Dictionary<string, string>? RimTags { get; set; } = new Dictionary<string, string>();
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public Dictionary<string, string>? TyreTags { get; set; } = new Dictionary<string, string>();
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? CompanyName { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? ModelName { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public string? ModificationName { get; set; }

        public DisplayPartView Normalize()
        {
            Tags = new Dictionary<string, string>();
            switch(ItemType)
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
            Part.FrontBackPosition = Part.FrontBackPosition ?? 0;
            Part.LeftRightPosition = Part.LeftRightPosition ?? 0;

            if (Part.FrontBackPosition == (int)PositionFB.None && Part.LeftRightPosition == (int)PositionLR.None)
            {
                return "";
            }

            string positionDesc = "";

            if (Part.FrontBackPosition != 0)
            {
                positionDesc = ConverterToString.FrontBackStr((PositionFB)Part.FrontBackPosition);
            }

            if (Part.LeftRightPosition != 0)
            {
                positionDesc += ConverterToString.LeftRightStr((PositionLR)Part.LeftRightPosition);
            }

            return positionDesc;
        }

        private void NormalizePart()
        {
            NormalizePartCar();
            NormalzeCommon();
        }
        private void NormalizeCar()
        {
            NormalizePartCar();
            NormalzeCommon();
        }
        private void NormalizeTyre(bool only = true)
        {
            TyreTags = new Dictionary<string, string>();
            string tyreWidth = "", tyreHeight = "", tyreRadius = "";
            if (ConverterToString.TyreWidthString(RimWithTyre.TyreWidth) != string.Empty)
            {
                tyreWidth = ConverterToString.TyreWidthString(RimWithTyre.TyreWidth);
                TyreTags.Add("Широчина", tyreWidth);
            }

            if (ConverterToString.TyreHeightString(RimWithTyre.TyreHeight) != string.Empty)
            {
                tyreHeight = ConverterToString.TyreHeightString(RimWithTyre.TyreHeight);
                TyreTags.Add("Височина", tyreHeight);
            }

            if (ConverterToString.TyreRadiusString(RimWithTyre.TyreRadius) != string.Empty)
            {
                tyreRadius = ConverterToString.TyreRadiusString(RimWithTyre.TyreRadius);
                TyreTags.Add("Радиус", tyreRadius);
            }

            if (tyreWidth.Length > 0 && tyreHeight.Length > 0 && tyreRadius.Length > 0)
                TyreTags.Add("Размер", $"{tyreWidth}/{tyreHeight}R{tyreRadius}");

            if (ConverterToString.TyreTypeString(RimWithTyre.TyreType) != string.Empty)
                TyreTags.Add("Вид", ConverterToString.TyreTypeString(RimWithTyre.TyreType));

            if (RimWithTyre.MonthDOT != null && RimWithTyre.MonthDOT != 0 &&
                RimWithTyre.YearDOT != null && RimWithTyre.YearDOT != 0)
            {
                string year = RimWithTyre.YearDOT.Value.ToString("D2");
                string month = RimWithTyre.MonthDOT.Value.ToString("D2");
                TyreTags.Add("DOT", $"{month}{year}");
            }

            if (ConverterToString.TyreProducersString(RimWithTyre.TyreCompanyId) != string.Empty)
                TyreTags.Add("Производител", ConverterToString.TyreProducersString(RimWithTyre.TyreCompanyId));

            if (RimWithTyre.Count != 0)
                TyreTags.Add("Брой", $"{RimWithTyre.Count}");

            if (only)
                NormalzeCommon();
        }

        private void NormalizeRim(bool only = true)
        {
            RimTags = new Dictionary<string, string>();

            if (ConverterToString.RimWidthString(RimWithTyre.RimWidth) != string.Empty)
                RimTags.Add("Щирочина", ConverterToString.RimWidthString(RimWithTyre.RimWidth));

            if (ConverterToString.RimMaterialString(RimWithTyre.RimMaterial) != string.Empty)
                RimTags.Add("Материал", ConverterToString.RimMaterialString(RimWithTyre.RimMaterial));

            if (RimWithTyre.RimCenter != null && RimWithTyre.RimCenter.Value != 0 &&
                ConverterToString.RimCenterString(RimWithTyre.RimCenter.Value) != string.Empty)
                RimTags.Add("Център", ConverterToString.RimCenterString(RimWithTyre.RimCenter.Value));

            if (RimWithTyre.RimOffset != null && ConverterToString.RimOffsetString(RimWithTyre.RimOffset.Value) != string.Empty)
                RimTags.Add("Офсет", ConverterToString.RimOffsetString(RimWithTyre.RimOffset.Value));

            if (RimWithTyre.RimBoltCount != null && ConverterToString.RimBoltCountString(RimWithTyre.RimBoltCount.Value) != string.Empty)
                RimTags.Add("Брой болтове", ConverterToString.RimBoltCountString(RimWithTyre.RimBoltCount.Value));

            if (RimWithTyre.RimBoltDistance != null && ConverterToString.RimBoltDistanceString(RimWithTyre.RimBoltDistance.Value) != string.Empty)
                RimTags.Add("Болт разстояние", ConverterToString.RimBoltDistanceString(RimWithTyre.RimBoltDistance.Value));

            if (RimWithTyre.RimBoltDistance != null && ConverterToString.BoltDistanceString(RimWithTyre.RimBoltDistance.Value) != string.Empty)
                RimTags.Add("Болт дистанция", ConverterToString.BoltDistanceString(RimWithTyre.RimBoltDistance.Value));

            if (only)
                NormalzeCommon();
        }

        private void NormalizeRimWithTyre()
        {
            NormalizeRim(false);
            NormalizeTyre(false);
            NormalzeCommon();
        }

        private void NormalizePartCar()
        {
            if (Part.EngineModel != null && Part.EngineType.Value != 0)
                EngineTypeDesc = ConverterToString.EngineTypeStr(Part.EngineType.Value);
            if (Part.GearboxType != null && Part.GearboxType.Value != 0)
                GearboxDesc = ConverterToString.GearboxTypeStr(Part.GearboxType.Value);
            if (Part.GearboxType != null && Part.GearboxType.Value != 0 && ConverterToString.GearboxTypeStr(Part.GearboxType.Value) != string.Empty)
                Tags.Add("Скоростна кутия", ConverterToString.GearboxTypeStr(Part.GearboxType.Value));

            if (Part.EngineType != null && Part.EngineType.Value != 0 && ConverterToString.EngineTypeStr(Part.EngineType.Value) != string.Empty)
                Tags.Add("Вид двигател", ConverterToString.EngineTypeStr(Part.EngineType.Value));
            if (Part.EngineModel.Length > 0)
                Tags.Add("Код двигател", $"Код двигател:{Part.EngineModel}");

            if (!Part.IsCar)
            {
                PositionDesc = GetPosition();
                if (PositionDesc != string.Empty)
                    Tags.Add("Позиция", $"Позиция {PositionDesc}");
            }
            if (Part.PowerkWh != null && Part.PowerkWh != 0)
                Tags.Add("Мощност", $"{Part.PowerkWh}KW/{Part.PowerBHP}BHP ");
            if (Part.Vin?.Length > 0)
                Tags.Add("VIN", $"{Part.Vin}");
            if ((ItemType == ItemType.BusPart || ItemType == ItemType.CarPart)  && Part.PartNumber.Length > 0 )
                Tags.Add("Номер на частта", $"Номер на частта: {Part.PartNumber}");
            if (Part.Millage != 0)
                Tags.Add("Пробег", $"{Part.Millage} км");


        }
        public void NormalzeCommon()
        {
            if (ItemType == ItemType.CarPart || ItemType == ItemType.BusPart || ItemType == ItemType.OnlyBus || ItemType == ItemType.OnlyCar) {
                if (ItemType == ItemType.OnlyCar)
                    DescriptionModel = $"Колa на части - {Part.CompanyName} {Part.ModelName}    {Part.ModificationName}";
                else if (ItemType == ItemType.OnlyBus)
                    DescriptionModel = $"Бус на части - {Part.CompanyName} {Part.ModelName}";
                else
                {
                    DescriptionModel = $"{Part.DealerSubCategoryName} за {Part.CompanyName} {Part.ModelName} {Part.ModificationName}";
                }
            } 
            else
            {
                if (ItemType == ItemType.Rim)
                {
                    DescriptionModel = "Джанта";
                }
                else if (ItemType == ItemType.Tyre)
                {
                    DescriptionModel = "Гума";
                }
                else if (ItemType == ItemType.RimWithTyre)
                {
                    DescriptionModel = "Гума с джанта";
                }
            }

            if (MainPicture == null)
                MainPicture = "assets/NoImage.jpg";

            if (ConverterToString.RegionString(RegionId) != string.Empty)
                Tags.TryAdd("Регион", ConverterToString.RegionString(RegionId));

            if (Description?.Length > 0)
                Tags.Add("Описание", $"{Description}");
        }
    }
}
