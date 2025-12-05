namespace Models.Models
{
    public class ValidationResult
    {
        public ValidationResult() { }
        bool IsValid { get; set; }
        string ExpiryDate { get; set; }
        string Message { get; set; }
    }
}
