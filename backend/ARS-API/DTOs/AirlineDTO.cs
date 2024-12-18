using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARS_API.DTOs
{
    public class AirlineDTO
    {
        public Guid AirlineId { get; set; }
        public string AirlineName { get; set; }
        public string AirlineCode { get; set; }
        public string Country { get; set; }
    }

    public class CreateAirlineDTO
    {
        public Guid AirlineId { get; set; }
        public string AirlineName { get; set; }
        public string AirlineCode { get; set; }
        public string Country { get; set; }
        public string LogoUrl { get; set; }
        public string ContactNumber { get; set; }
        public string WebsiteUrl { get; set; }

    }
}
