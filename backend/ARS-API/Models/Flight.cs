using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ARS_API.Models
{
    public class Flight
    {
        [Key]
        public Guid FlightId { get; set; } 

        [Required]
        [StringLength(10)]
        public string FlightNumber { get; set; }

        [Required]
        public Guid AirlineId { get; set; } 

        [ForeignKey("AirlineId")]
        public Airline Airline { get; set; } 

        [Required]
        public Guid OriginAirportId { get; set; } 

        [ForeignKey("OriginAirportId")]
        public Airport OriginAirport { get; set; } 

        [Required]
        public Guid DestinationAirportId { get; set; } 

        [ForeignKey("DestinationAirportId")]
        public Airport DestinationAirport { get; set; } 

        [Required]
        public DateTime DepartureTime { get; set; } 

        [Required]
        public DateTime ArrivalTime { get; set; } 

        [Required]
        public int Duration { get; set; }

        [Required]
        public int TotalSeats { get; set; }

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal BasePrice { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; }

        public ICollection<FlightSeatAllocation> FlightSeatAllocations { get; set; }
    }
}
