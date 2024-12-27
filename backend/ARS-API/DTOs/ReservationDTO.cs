using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARS_API.DTOs
{
    public class ReservationDTO
    {
        public string ReservationCode { get; set; }
        public string UserId { get; set; }
        public Guid FlightId { get; set; }
        public Guid AllocationId { get; set; }
        public string ReservationStatus { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime TravelDate { get; set; }
        public int? NumberOfBlockedSeats { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateReservationDTO
    {
        public string UserId { get; set; }
        public Guid FlightId { get; set; }
        public Guid AllocationId { get; set; }
        public int? NumberOfBlockedSeats { get; set; }
        public string? ReservationStatus { get; set; }
        public List<CreatePassengerDTO>? Passengers { get; set; } // Only required for "Confirmed"
    }

    public class ReservationUpdateDTO
    {
        public string? ReservationStatus { get; set; } // "Confirmed" or "Cancelled" only
        public int? NumberOfBlockedSeats { get; set; } // Only allows reducing seats
        public List<PassengerDTO>? Passengers { get; set; } // Only required for "Confirmed"
    }

}