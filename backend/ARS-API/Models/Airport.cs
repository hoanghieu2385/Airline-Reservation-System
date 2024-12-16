using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ARS_API.Models
{
    public class Airport
    {
        [Key]
        public Guid AirportId { get; set; }

        [Required]
        public Guid CityId { get; set; } 

        [ForeignKey("CityId")]
        public City City { get; set; } 

        [Required]
        [StringLength(10)]
        public string AirportCode { get; set; } 

        [Required]
        [StringLength(150)]
        public string AirportName { get; set; } 
    }
}
