using ARS_API.DTOs;
using ARS_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ARS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class EticketController : ControllerBase
    {
        private readonly ApplicationDBContext _dbContext;

        public EticketController(ApplicationDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET: api/ETicket/all
        [HttpGet("all")]
        public async Task<IActionResult> GetAllETickets()
        {
            var tickets = await _dbContext.Passengers
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
                            .ThenInclude(fsa => fsa.SeatClass)
                .ToListAsync();

            var eTickets = tickets.Select(passenger =>
            {
                var flight = passenger.Reservation.Flight;
                var flightSeatAllocation = flight.FlightSeatAllocations
                    .FirstOrDefault(fsa => fsa.AllocationId == passenger.Reservation.AllocationId);

                return new
                {
                    PassengerId = passenger.PassengerId,
                    Passenger = new
                    {
                        FullName = $"{passenger.FirstName} {passenger.LastName}",
                        Age = passenger.Age,
                        Gender = passenger.Gender,
                        TicketCode = passenger.TicketCode,
                        TicketPrice = passenger.TicketPrice
                    },
                    FromTo = $"{flight.OriginAirport.AirportName} -> {flight.DestinationAirport.AirportName}",
                    FlightDate = passenger.Reservation.TravelDate.ToString("dddd, d MMMM yyyy"),
                    Airline = flight.Airline.AirlineName,
                    Amenities = $"{flightSeatAllocation?.SeatClass.LuggageAllowance}kg luggage",
                    ReservationCode = passenger.Reservation.ReservationCode
                };
            });

            return Ok(eTickets);
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
                            .ThenInclude(fsa => fsa.SeatClass)
                .FirstOrDefaultAsync(p => p.TicketCode == ticketCode);

            if (passenger == null)
                return NotFound(new { Message = "Ticket not found." });

            var reservation = passenger.Reservation;
            var flight = reservation.Flight;
            var flightSeatAllocation = await _dbContext.Set<FlightSeatAllocation>()
                .Include(fsa => fsa.SeatClass)
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
                Amenities = $"{flightSeatAllocation.SeatClass.LuggageAllowance}kg luggage",
                ReservationCode = reservation.ReservationCode
            };

            return Ok(eTicket);
        }

        // GET: api/ETicket/customerinfo/{reservationCode}
        [HttpGet("customerinfo/{reservationCode}")]
        public async Task<IActionResult> GetCustomerInfoByReservationCode(string reservationCode)
        {
            var reservation = await _dbContext.Reservations
                .Include(r => r.Flight)
                    .ThenInclude(f => f.OriginAirport)
                .Include(r => r.Flight)
                    .ThenInclude(f => f.DestinationAirport)
                .Include(r => r.Flight)
                    .ThenInclude(f => f.Airline)
                .Include(r => r.Passengers)
                .FirstOrDefaultAsync(r => r.ReservationCode == reservationCode);

            if (reservation == null)
            {
                return NotFound(new { Message = "No reservation found for the provided Reservation Code." });
            }

            var customerInfo = new
            {
                ReservationCode = reservation.ReservationCode,
                FlightDetails = new
                {
                    FromTo = $"{reservation.Flight.OriginAirport.AirportName} -> {reservation.Flight.DestinationAirport.AirportName}",
                    Airline = reservation.Flight.Airline.AirlineName,
                    TravelDate = reservation.TravelDate.ToString("dddd, d MMMM yyyy"),
                    TotalPrice = reservation.TotalPrice
                },
                Passengers = reservation.Passengers.Select(p => new
                {
                    FullName = $"{p.FirstName} {p.LastName}",
                    Age = p.Age,
                    Gender = p.Gender,
                    TicketCode = p.TicketCode,
                    TicketPrice = p.TicketPrice
                })
            };

            return Ok(customerInfo);
        }

        // PUT: api/ETicket/{passengerId}
        [HttpPut("{passengerId}")]
        public async Task<IActionResult> UpdateETicket(Guid passengerId, [FromBody] UpdatePassengerDTO updateDTO)
        {
            var passenger = await _dbContext.Passengers
                .Include(p => p.Reservation)
                .FirstOrDefaultAsync(p => p.PassengerId == passengerId);

            if (passenger == null)
                return NotFound(new { Message = "Passenger not found." });

            // C?p nh?t th�ng tin h�nh kh�ch
            passenger.FirstName = updateDTO.FirstName;
            passenger.LastName = updateDTO.LastName;
            passenger.Age = updateDTO.Age;
            passenger.Gender = updateDTO.Gender;

            try
            {
                await _dbContext.SaveChangesAsync();
                return Ok(new { Message = "Passenger information updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while updating passenger information.", Error = ex.Message });
            }
        }

        // DELETE: api/ETicket/{passengerId}
        [HttpDelete("{passengerId}")]
        public async Task<IActionResult> DeleteETicket(Guid passengerId)
        {
            var passenger = await _dbContext.Passengers
                .Include(p => p.Reservation)
                .FirstOrDefaultAsync(p => p.PassengerId == passengerId);

            if (passenger == null)
                return NotFound(new { Message = "Passenger not found." });

            try
            {
                _dbContext.Passengers.Remove(passenger);
                await _dbContext.SaveChangesAsync();
                return Ok(new { Message = "Passenger and associated ticket deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while deleting the passenger.", Error = ex.Message });
            }
        }

        // POST: api/ETicket
        [HttpPost]
        public async Task<IActionResult> CreateETicket([FromBody] CreateETicketPassengerDTO createDTO)
        {
            // Ki?m tra reservation c� t?n t?i kh�ng
            var reservation = await _dbContext.Reservations
                .Include(r => r.Flight)
                .FirstOrDefaultAsync(r => r.ReservationId == createDTO.ReservationId);

            if (reservation == null)
                return NotFound(new { Message = "Reservation not found." });

            var newPassenger = new Passenger
            {
                PassengerId = Guid.NewGuid(),
                ReservationId = createDTO.ReservationId,
                FirstName = createDTO.FirstName,
                LastName = createDTO.LastName,
                Age = createDTO.Age,
                Gender = createDTO.Gender,
                TicketCode = GenerateTicketCode(), // H�m t?o m� v�
                TicketPrice = createDTO.TicketPrice
            };

            try
            {
                await _dbContext.Passengers.AddAsync(newPassenger);
                await _dbContext.SaveChangesAsync();

                return CreatedAtAction(nameof(GetETicketByTicketCode),
                    new { ticketCode = newPassenger.TicketCode },
                    new { Message = "Passenger and ticket created successfully.", TicketCode = newPassenger.TicketCode });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while creating the passenger.", Error = ex.Message });
            }
        }

        private string GenerateTicketCode()
        {
            // T?o m� v� ng?u nhi�n v?i ??nh d?ng: TK + n?m + th�ng + ng�y + 4 s? ng?u nhi�n
            string dateComponent = DateTime.Now.ToString("yyyyMMdd");
            string randomComponent = new Random().Next(1000, 9999).ToString();
            return $"TK{dateComponent}{randomComponent}";
        }
    }
}
