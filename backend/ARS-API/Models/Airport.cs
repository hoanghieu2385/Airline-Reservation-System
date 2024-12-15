using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ARS_API.Models
{
    public class Airport
    {
        [Key]
        public Guid AirportId { get; set; } // Primary key

        [Required]
        public Guid CityId { get; set; } // Foreign key to Cities table

        [ForeignKey("CityId")]
        public City City { get; set; } // Navigation property for City

        [Required]
        [StringLength(10)]
        public string AirportCode { get; set; } // Unique airport code (e.g., HAN)

        [Required]
        [StringLength(150)]
        public string AirportName { get; set; } // Full name of the airport
    }
}
