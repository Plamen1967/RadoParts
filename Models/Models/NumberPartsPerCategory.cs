namespace Rado.Models
{
    public class NumberPartsPerCategory
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int NumberParts { get; set; }

        public List<SubCategory> SubCategories { get; set; }
    }
}
