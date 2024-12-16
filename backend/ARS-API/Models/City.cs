using System;
using System.ComponentModel.DataAnnotations;

namespace ARS_API.Models
{
    public class City
    {
        [Key]
        public Guid CityId { get; set; }

        [Required]
        [StringLength(100)]
        public string CityName { get; set; }

        [StringLength(100)]
        public string State { get; set; } 

        [StringLength(100)]
        public string Country { get; set; }
    }
}
