using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARS_API.DTOs
{
    public class ReservationDTO
    {
        public Guid ReservationId { get; set; }
        public string ReservationCode { get; set; }
        public string UserId { get; set; }
        public Guid FlightId { get; set; }
        public Guid AllocationId { get; set; }
        public string ReservationStatus { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime TravelDate { get; set; }
        public string FormattedTravelDate => TravelDate.ToString("dd-MM-yyyy, HH:mm");
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
    }

}