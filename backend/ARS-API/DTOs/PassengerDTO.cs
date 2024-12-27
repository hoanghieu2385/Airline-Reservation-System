using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARS_API.DTOs
{
    public class PassengerDTO
    {
        public Guid PassengerId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public string TicketCode { get; set; }
        public decimal TicketPrice { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }

    public class CreatePassengerDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }

    public class CreateETicketPassengerDTO
    {
        public Guid ReservationId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public decimal TicketPrice { get; set; }
    }

    public class UpdatePassengerDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        public string Gender { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }


}