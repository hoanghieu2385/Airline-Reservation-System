using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ARS_API.Models
{
    public class Reservation
    {
        public Guid ReservationId { get; set; }
        public string ReservationCode { get; set; }
        public string UserId { get; set; }
        public Guid FlightId { get; set; }
        public Guid AllocationId { get; set; }
        public string ReservationStatus { get; set; }
        
        [Column(TypeName = "decimal(10, 2)")]
        public decimal TotalPrice { get; set; }
        public DateTime TravelDate { get; set; }
        public int? NumberOfBlockedSeats { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}