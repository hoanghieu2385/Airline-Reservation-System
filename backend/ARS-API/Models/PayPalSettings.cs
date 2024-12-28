namespace ARS_API.Models
{
    public class PayPalSettings
    {
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
        public bool IsSandbox { get; set; } = true;
    }
}
