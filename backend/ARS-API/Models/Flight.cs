using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ARS_API.Models
{
    public class Flight
    {
        [Key]
        public Guid FlightId { get; set; } // Primary key

        [Required]
        [StringLength(10)]
        public string FlightNumber { get; set; } // Unique flight code

        [Required]
        public Guid AirlineId { get; set; } // Foreign key to Airlines table

        [ForeignKey("AirlineId")]
        public Airline Airline { get; set; } // Navigation property for Airline

        [Required]
        public Guid OriginAirportId { get; set; } // Foreign key to Origin Airport

        [ForeignKey("OriginAirportId")]
        public Airport OriginAirport { get; set; } // Navigation property for Origin Airport

        [Required]
        public Guid DestinationAirportId { get; set; } // Foreign key to Destination Airport

        [ForeignKey("DestinationAirportId")]
        public Airport DestinationAirport { get; set; } // Navigation property for Destination Airport

        [Required]
        public DateTime DepartureTime { get; set; } // Flight departure time

        [Required]
        public DateTime ArrivalTime { get; set; } // Flight arrival time

        [Required]
        public int Duration { get; set; } // Flight duration in minutes

        [Required]
        public int TotalSeats { get; set; } // Total seats available on the flight

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal BasePrice { get; set; } // Base price for Economy class

        [Required]
        [StringLength(50)]
        public string Status { get; set; } // Flight status (e.g., Scheduled, Cancelled)
    }
}
