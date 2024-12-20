using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARS_API.DTOs
{
    public class FlightSeatAllocationDTO
    {
        public string ClassName { get; set; } // Must match a SeatClass in this airline
        public int AvailableSeats { get; set; }
    }

    public class UpdateFlightSeatAllocationDTO
    {
        public int AvailableSeats { get; set; }
    }
}