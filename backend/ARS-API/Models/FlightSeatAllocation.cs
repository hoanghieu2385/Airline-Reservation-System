using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ARS_API.Models
{
    public class FlightSeatAllocation
    {
        [Key]
        public Guid AllocationId { get; set; }
        public Guid FlightId { get; set; }
        public Guid ClassId { get; set; }
        public int AvailableSeats { get; set; }

    }
}