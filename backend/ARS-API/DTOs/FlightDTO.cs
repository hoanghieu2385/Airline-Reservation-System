using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ARS_API.DTOs
{
    public class FlightDTO
    {
        public Guid FlightId { get; set; }
        public string FlightNumber { get; set; }
        public Guid AirlineId { get; set; }
        public string AirlineName { get; set; }
        public string OriginAirportName { get; set; }
        public string DestinationAirportName { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public int Duration { get; set; }
        public int TotalSeats { get; set; }
        public decimal BasePrice { get; set; }
        public string Status { get; set; }
        public List<FlightSeatAllocationDTO> SeatAllocations { get; internal set; }
    }

    public class CreateFlightDto
    {
        [Required]
        [StringLength(10)]
        public string FlightNumber { get; set; }

        [Required]
        public Guid AirlineId { get; set; }

        [Required]
        public Guid OriginAirportId { get; set; }

        [Required]
        public Guid DestinationAirportId { get; set; }

        [Required]
        public DateTime DepartureTime { get; set; }

        [Required]
        public DateTime ArrivalTime { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Duration { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int TotalSeats { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal BasePrice { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; }

        public List<FlightSeatAllocationDTO> SeatAllocations { get; set; }
    }

    public class UpdateFlightDto
    {
        [Required]
        public DateTime DepartureTime { get; set; }

        [Required]
        public DateTime ArrivalTime { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } // "Active", "Delayed", "Cancelled"
    }


}
