using ARS_API.DTOs;
using ARS_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ARS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EticketController : ControllerBase
    {
        private readonly ApplicationDBContext _dbContext;

        public EticketController(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET: api/ETicket/{ticketCode}
        [HttpGet("{ticketCode}")]
        public async Task<IActionResult> GetETicketByTicketCode(string ticketCode)
        {
            // Find the passenger using TicketCode
            var passenger = await _dbContext.Set<Passenger>()
                .Include(p => p.Reservation)
                    .ThenInclude(r => r.Flight)
                        .ThenInclude(f => f.Airline)
                .Include(p => p.Reservation)
                    .ThenInclude(r => r.Flight)
                        .ThenInclude(f => f.OriginAirport)
                .Include(p => p.Reservation)
                    .ThenInclude(r => r.Flight)
                        .ThenInclude(f => f.DestinationAirport)
                .Include(p => p.Reservation)
                    .ThenInclude(r => r.Flight)
                        .ThenInclude(f => f.FlightSeatAllocations)
                            .ThenInclude(fsa => fsa.Class)
                .FirstOrDefaultAsync(p => p.TicketCode == ticketCode);

            if (passenger == null)
                return NotFound(new { Message = "Ticket not found." });

            var reservation = passenger.Reservation;
            var flight = reservation.Flight;
            var flightSeatAllocation = await _dbContext.Set<FlightSeatAllocation>()
                .Include(fsa => fsa.Class)
                .FirstOrDefaultAsync(fsa => fsa.AllocationId == reservation.AllocationId);

            if (flightSeatAllocation == null)
                return NotFound(new { Message = "Flight seat allocation not found." });

            // Construct the eTicket response
            var eTicket = new
            {
                Passenger = new
                {
                    FullName = $"{passenger.FirstName} {passenger.LastName}",
                    Age = passenger.Age,
                    Gender = passenger.Gender,
                    TicketCode = passenger.TicketCode,
                    TicketPrice = passenger.TicketPrice
                },
                FromTo = $"{flight.OriginAirport.AirportName} -> {flight.DestinationAirport.AirportName}",
                FlightDate = reservation.TravelDate.ToString("dddd, d MMMM yyyy"),
                Airline = flight.Airline.AirlineName,
                Amenities = $"{flightSeatAllocation.Class.LuggageAllowance}kg luggage",
                ReservationCode = reservation.ReservationCode
            };

            return Ok(eTicket);
        }
    }
}
