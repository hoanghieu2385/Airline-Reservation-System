namespace ARS_API.Dtos
{
    public class AirportDto
    {
        public Guid AirportId { get; set; }
        public string AirportName { get; set; }
        public string AirportCode { get; set; }
        public string CityName { get; set; }
        public string Country { get; set; }
    }
}
