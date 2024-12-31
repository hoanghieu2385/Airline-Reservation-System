namespace ARS_API.DTOs
{
    public class FlightRoutelDTO
    {
        public Guid FlightRouteId { get; set; }
        public string OriginAirportName { get; set; }
        public string DestinationAirportName { get; set; }
        public int Distance { get; set; }
    }
    public class CreateRouteDTO
    {
        public Guid OriginAirportId { get; set; }
        public Guid DestinationAirportId { get; set; }
        public int Distance { get; set; }
    }

    public class UpdateRouteDTO
    {
        public Guid RouteId { get; set; }
        public Guid OriginAirportId { get; set; }
        public Guid DestinationAirportId { get; set; }
        public int Distance { get; set; }
    }
}
