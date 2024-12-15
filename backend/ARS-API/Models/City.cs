using System;
using System.ComponentModel.DataAnnotations;

namespace ARS_API.Models
{
    public class City
    {
        [Key]
        public Guid CityId { get; set; } // Primary key

        [Required]
        [StringLength(100)]
        public string CityName { get; set; } // Name of the city

        [StringLength(100)]
        public string State { get; set; } // State of the city (optional)

        [StringLength(100)]
        public string Country { get; set; } // Country of the city
    }
}
