using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ARS_API.Models
{
    public class FlightRoute
    {
        [Key]
        public Guid FlightRouteId { get; set; }

        [Required]
        public Guid OriginAirportId { get; set; }

        [Required]
        public Guid DestinationAirportId { get; set; }

        public int Distance { get; set; }

        [ForeignKey("OriginAirportId")]
        public virtual Airport OriginAirport { get; set; }

        [ForeignKey("DestinationAirportId")]
        public virtual Airport DestinationAirport { get; set; }
    }
}
