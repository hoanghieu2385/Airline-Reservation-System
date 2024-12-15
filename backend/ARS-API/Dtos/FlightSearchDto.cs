namespace ARS_API.Dtos
{
    public class FlightSearchDto
    {
        public Guid OriginAirportId { get; set; }
        public Guid DestinationAirportId { get; set; }
        public DateTime DepartureDate { get; set; }
        public int Passengers { get; set; }
    }
}
