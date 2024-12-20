using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARS_API.Models
{
    public class Passenger
    {
        public Guid PassengerId { get; set; }
        public Guid ReservationId { get; set; } // Foreign key to Reservations
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public string TicketCode { get; set; } // Unique 12-digit code
        public decimal TicketPrice { get; set; }
    }
}