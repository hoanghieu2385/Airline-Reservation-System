namespace ARS_API.DTOs
{
    public class CreatePaymentRequestDTO
    {
        public string Amount { get; set; }
        public string Currency { get; set; } = "USD";
        public string Description { get; set; }
        public string ReturnUrl { get; set; }
        public string CancelUrl { get; set; }
    }
}
