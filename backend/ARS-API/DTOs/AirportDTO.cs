using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARS_API.DTOs
{
    public class AirportDTO
    {
        public Guid AirportId { get; set; }
        public string AirportCode { get; set; }
        public string AirportName { get; set; }
        public string CityName { get; set; }
        public string Country { get; set; }
    }

    namespace ARS_API.DTOs
    {
        public class CreateAirportDTO
        {
            public Guid CityId { get; set; }
            public string AirportCode { get; set; }
            public string AirportName { get; set; }
        }
    }

    public class UpdateAirportDTO
    {
        public Guid AirportId { get; set; } // Required for matching
        public string AirportCode { get; set; }
        public string AirportName { get; set; }
        public Guid CityId { get; set; }
    }


}
