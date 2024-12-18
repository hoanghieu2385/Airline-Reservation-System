using System;
using System.ComponentModel.DataAnnotations;

namespace ARS_API.Models
{
    public class Airline
    {
        [Key]
        public Guid AirlineId { get; set; } 

        [Required]
        [StringLength(150)]
        public string AirlineName { get; set; } 

        [Required]
        [StringLength(10)]
        public string AirlineCode { get; set; } 

        [StringLength(100)]
        public string Country { get; set; } 

        [StringLength(255)]
        public string LogoUrl { get; set; } 

        [StringLength(20)]
        public string ContactNumber { get; set; } 

        [StringLength(255)]
        public string WebsiteUrl { get; set; } 
    }
}
