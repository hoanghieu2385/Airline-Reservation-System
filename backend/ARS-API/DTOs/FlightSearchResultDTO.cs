using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARS_API.DTOs
{
    public class FlightSearchResultDTO
    {
        public Guid FlightId { get; set; }
        public string FlightNumber { get; set; }
        public string AirlineName { get; set; }
        public string OriginAirportCode { get; set; }
        public DateTime DepartureTime { get; set; }
        public string DestinationAirportCode { get; set; }
        public DateTime ArrivalTime { get; set; }
        public decimal DynamicPrice { get; set; }
        public string SeatClass { get; set; }
        public int AvailableSeats { get; set; }
    }

}