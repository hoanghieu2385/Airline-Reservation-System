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
        public DateTime DepartureTime { get; set; }
        public decimal DynamicPrice { get; set; }
        public string SeatClass { get; set; }
        public int AvailableSeats { get; set; }
    }

}