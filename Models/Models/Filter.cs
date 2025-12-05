using Microsoft.Data.SqlClient;
using Rado.Enums;

namespace Models.Models
{
    public class Filter
    {
        public long id { get; set; }
        public ItemType itemType { get; set; }
        public int bus { get; set; }
        public long carId { get; set; }
        public int companyId { get; set; }
        public int modelId { get; set; }
        public string? modelsId { get; set; }
        public int modificationId { get; set; }
        public string? modificationsId { get; set; }
        public int year { get; set; }
        public int categoryId { get; set; }
        public string? categoriesId { get; set; }
        public int subCategoryId { get; set; }
        public string? subCategoriesId { get; set; }
        public int engineType { get; set; }
        public string? engineModel { get; set; }
        public string? partNumber { get; set; }
        public int powerkWh { get; set; }
        public int powerBHP { get; set; }
        public int gearboxType { get; set; }
        public string? categories { get; set; }
        public bool partOnly { get; set; }
        public SearchBy searchBy { get; set; }
        public string? regNumber { get; set; }
        public bool extendedSearch { get; set; }
        public SearchType searchType { get; set; }
        public int tyreCompanyId { get; set; }
        public int tyreWidth { get; set; }
        public int tyreHeight { get; set; }
        public int tyreRadius { get; set; }
        public int tyreType { get; set; }
        public int rimCompanyId { get; set; }
        public int rimModelId { get; set; }
        public int rimWidth { get; set; }
        public int rimMaterial { get; set; }
        public int rimOffset { get; set; }
        public int rimBoltCount { get; set; }
        public int rimBoltDistance { get; set; }
        public int rimCenter { get; set; }
        public long clientId { get; set; }
        public int? userId { get; set; }
        public bool loadMainPicture { get; set; }
        public int orderBy { get; set; }
        public int regionId { get; set; }
        public bool hasImages { get; set; }
        public string? keyword { get; set; }
        public string? description { get; set; }
        public bool adminRun { get; set; }
        public int partForCar { get; set; }
        public Dictionary<string, string>? keywords { get; set; }
        public ApprovedType approved { get; set; }
        public bool loaded { get; set; } = false;

    }


}
