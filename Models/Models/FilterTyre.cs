using Rado.Enums;

namespace Rado.Models
{
    public class FilterTyre
    {
        long tyreCompanyId { get; set; }
        int tyreWidth { get; set; }
        int tyreHeight { get; set; }
        int tyreRadius { get; set; }
        int tyreType { get; set; }
        int clientId { get; set; }
        long userId { get; set; }
        bool loadMainPicture { get; set; }
        int orderBy { get; set; }
        long id { get; set; }
        SearchBy searchBy { get; set; }
        int searchType { get; set; }
        bool adminRun { get; set; }
    }
}
