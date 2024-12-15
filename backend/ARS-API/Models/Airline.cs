using System;
using System.ComponentModel.DataAnnotations;

namespace ARS_API.Models
{
    public class Airline
    {
        [Key]
        public Guid AirlineId { get; set; } // Primary key

        [Required]
        [StringLength(150)]
        public string AirlineName { get; set; } // Name of the airline

        [Required]
        [StringLength(10)]
        public string AirlineCode { get; set; } // Unique airline code (e.g., VA for Vietnam Airlines)

        [StringLength(100)]
        public string Country { get; set; } // Country of the airline (optional)

        [StringLength(255)]
        public string LogoUrl { get; set; } // URL to airline logo (optional)

        [StringLength(20)]
        public string ContactNumber { get; set; } // Contact number (optional)

        [StringLength(255)]
        public string WebsiteUrl { get; set; } // Website URL (optional)

        public ICollection<Flight> Flights { get; set; }

        public Airline()
        {
            Flights = new List<Flight>();
        }
    }
}
