using Microsoft.Data.SqlClient;
using Rado.Enums;

namespace Models.Models
{
    public class Filter
    {
        public long Id { get; set; }
        public ItemType ItemType { get; set; }
        public int Bus { get; set; }
        public long CarId { get; set; }
        public int CompanyId { get; set; }
        public int ModelId { get; set; }
        public string? ModelsId { get; set; }
        public int ModificationId { get; set; }
        public string? ModificationsId { get; set; }
        public int Year { get; set; }
        public int CategoryId { get; set; }
        public string? CategoriesId { get; set; }
        public int SubCategoryId { get; set; }
        public string? SubCategoriesId { get; set; }
        public int EngineType { get; set; }
        public string? EngineModel { get; set; }
        public string? PartNumber { get; set; }
        public int PowerkWh { get; set; }
        public int PowerBHP { get; set; }
        public int GearboxType { get; set; }
        public string? Categories { get; set; }
        public bool PartOnly { get; set; }
        public SearchBy SearchBy { get; set; }
        public string? RegNumber { get; set; }
        public bool ExtendedSearch { get; set; }
        public SearchType SearchType { get; set; }
        public int TyreCompanyId { get; set; }
        public int TyreWidth { get; set; }
        public int TyreHeight { get; set; }
        public int TyreRadius { get; set; }
        public int TyreType { get; set; }
        public int RimCompanyId { get; set; }
        public int RimModelId { get; set; }
        public int RimWidth { get; set; }
        public int RimMaterial { get; set; }
        public int RimOffset { get; set; }
        public int RimBoltCount { get; set; }
        public int RimBoltDistance { get; set; }
        public int RimCenter { get; set; }
        public long ClientId { get; set; }
        public int? UserId { get; set; }
        public bool LoadMainPicture { get; set; }
        public int OrderBy { get; set; }
        public int RegionId { get; set; }
        public bool HasImages { get; set; }
        public string? Keyword { get; set; }
        public string? Description { get; set; }
        public bool AdminRun { get; set; }
        public int PartForCar { get; set; }
        public Dictionary<string, string>? Keywords { get; set; }
        public ApprovedType Approved { get; set; }
        public bool Loaded { get; set; } = false;

    }


}
