using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ARS_API.Models;
using ARS_API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ARS_API.Services;

namespace ARS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReservationsController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly PricingService _pricingService;
        private readonly IEmailService _emailService;
        private readonly ILogger<ReservationsController> _logger;

        public ReservationsController(ApplicationDBContext context, PricingService pricingService, IEmailService emailService, ILogger<ReservationsController> logger)
        {
            _context = context;
            _pricingService = pricingService;
            _emailService = emailService;
            _logger = logger;
        }

        // GET: api/Reservations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReservationDTO>>> GetReservations()
        {
            var reservations = await _context.Reservations
                .Include(r => r.Flight)
                .Join(
                    _context.Users,
                    reservation => reservation.UserId,
                    user => user.Id,
                    (reservation, user) => new { reservation, user })
                .Select(ru => new ReservationDTO
                {
                    ReservationId = ru.reservation.ReservationId,
                    ReservationCode = ru.reservation.ReservationCode,
                    UserId = ru.reservation.UserId,
                    UserName = ru.user.UserName,
                    FlightId = ru.reservation.FlightId,
                    AllocationId = ru.reservation.AllocationId,
                    ReservationStatus = ru.reservation.ReservationStatus,
                    TotalPrice = ru.reservation.TotalPrice,
                    TravelDate = ru.reservation.TravelDate,
                    CreatedAt = ru.reservation.CreatedAt,
                    NumberOfBlockedSeats = ru.reservation.NumberOfBlockedSeats
                })
                .ToListAsync();

            return Ok(reservations);
        }

        // GET: api/Reservations/{code}
        [HttpGet("{code}")]
        [Authorize(Roles = "USER")]
        public async Task<ActionResult<ReservationDTO>> GetReservationByCode(string code)
        {
            var reservation = await _context.Reservations
                .Include(r => r.Flight) // Include Flight to access DepartureTime
                .Where(r => r.ReservationCode == code)
                .Select(r => new ReservationDTO
                {
                    ReservationCode = r.ReservationCode,
                    UserId = r.UserId,
                    FlightId = r.FlightId,
                    AllocationId = r.AllocationId,
                    ReservationStatus = r.ReservationStatus,
                    TotalPrice = r.TotalPrice,
                    TravelDate = r.TravelDate,
                    CreatedAt = r.CreatedAt,
                    NumberOfBlockedSeats = r.NumberOfBlockedSeats
                })
                .FirstOrDefaultAsync();

            if (reservation == null)
            {
                return NotFound();
            }

            return Ok(reservation);
        }

        // GET: api/Reservations/Search
        [HttpGet("Search")]
        [Authorize(Roles = "ADMIN,CLERK")]
        public async Task<ActionResult<IEnumerable<ReservationDTO>>> SearchReservations(
        [FromQuery] string? reservationCode,
        [FromQuery] string? userId,
        [FromQuery] string? userName,
        [FromQuery] Guid? flightId,
        [FromQuery] bool includeCancelled = false)
        {
            var query = _context.Reservations.AsQueryable();

            if (!string.IsNullOrEmpty(reservationCode))
            {
                query = query.Where(r => r.ReservationCode.Contains(reservationCode));
            }

            if (!string.IsNullOrEmpty(userId))
            {
                query = query.Where(r => r.UserId == userId);
            }

            if (!string.IsNullOrEmpty(userName))
            {
                query = query.Join(
                    _context.Users,
                    reservation => reservation.UserId,
                    user => user.Id,
                    (reservation, user) => new { reservation, user })
                    .Where(ru => ru.user.Email.Contains(userName))
                    .Select(ru => ru.reservation);
            }

            if (flightId.HasValue)
            {
                query = query.Where(r => r.FlightId == flightId);
            }

            // Filter out "Cancelled" reservations if includeCancelled is false
            if (!includeCancelled)
            {
                query = query.Where(r => r.ReservationStatus != "Cancelled");
            }

            var reservations = await query
                .Include(r => r.Flight)
                .Join(
                    _context.Users,
                    reservation => reservation.UserId,
                    user => user.Id,
                    (reservation, user) => new { reservation, user })
                .OrderByDescending(ru => ru.reservation.CreatedAt) // Sort by CreatedAt
                .Select(ru => new ReservationDTO
                {
                    ReservationId = ru.reservation.ReservationId,
                    ReservationCode = ru.reservation.ReservationCode,
                    UserId = ru.reservation.UserId,
                    UserName = ru.user.Email,
                    FlightId = ru.reservation.FlightId,
                    AllocationId = ru.reservation.AllocationId,
                    ReservationStatus = ru.reservation.ReservationStatus,
                    TotalPrice = ru.reservation.TotalPrice,
                    TravelDate = ru.reservation.TravelDate,
                    CreatedAt = ru.reservation.CreatedAt,
                    NumberOfBlockedSeats = ru.reservation.NumberOfBlockedSeats
                })
                .ToListAsync();

            if (!reservations.Any())
            {
                return NotFound("No reservations found for the given criteria.");
            }

            return Ok(reservations);
        }

        // POST: api/Reservations/FinalizeReservation
        [HttpPost("FinalizeReservation")]
        public async Task<ActionResult<Reservation>> FinalizeReservation(CreateReservationDTO createReservationDto)
        {

            // Validate seat allocation
            var allocation = await _context.FlightSeatAllocation
                .Include(fsa => fsa.SeatClass) // Ensure SeatClass is loaded
                .FirstOrDefaultAsync(fsa => fsa.AllocationId == createReservationDto.AllocationId);

            if (allocation == null || allocation.AvailableSeats < createReservationDto.Passengers.Count)
            {
                return BadRequest("Invalid seat allocation or insufficient seats.");
            }

            // Validate flight
            var flight = await _context.Flights
                .Include(f => f.Airline)
                .FirstOrDefaultAsync(f => f.FlightId == createReservationDto.FlightId);

            if (flight == null)
            {
                return BadRequest("Invalid flight ID.");
            }

            // Process data received from frontend
            var travelDate = flight.DepartureTime;
            var daysBeforeDeparture = (travelDate - DateTime.UtcNow).Days;
            var priceMultiplier = await _pricingService.GetPriceMultiplierAsync(daysBeforeDeparture);

            // Calculate total price for passengers
            decimal totalPrice = createReservationDto.Passengers.Sum(p =>
                _pricingService.CalculateDynamicPrice(
                    flight.BasePrice,
                    allocation.SeatClass.BasePriceMultiplier,
                    priceMultiplier)
            );

            // Determine block expiration time if ReservationStatus is "Blocked"
            DateTime? blockExpirationTime = null;
            if (createReservationDto.ReservationStatus == "Blocked")
            {
                if (daysBeforeDeparture >= 14)
                {
                    blockExpirationTime = DateTime.UtcNow.AddHours(72); // 72 hours
                }
                else if (daysBeforeDeparture < 14 && daysBeforeDeparture >= 1)
                {
                    blockExpirationTime = DateTime.UtcNow.AddHours(2); // 2 hours
                }
                else if (daysBeforeDeparture < 1)
                {
                    blockExpirationTime = DateTime.UtcNow.AddMinutes(10); // 10 minutes
                }
            }

            Console.WriteLine($"ReservationStatus: {createReservationDto.ReservationStatus}");
            Console.WriteLine($"DaysBeforeDeparture: {daysBeforeDeparture}");
            Console.WriteLine($"BlockExpirationTime: {blockExpirationTime}");

            // Create a new reservation
            var reservation = new Reservation
            {
                ReservationId = Guid.NewGuid(),
                ReservationCode = GenerateReservationCode(),
                UserId = createReservationDto.UserId,
                FlightId = createReservationDto.FlightId,
                AllocationId = createReservationDto.AllocationId,
                ReservationStatus = string.IsNullOrWhiteSpace(createReservationDto.ReservationStatus)
                ? "Blocked"
                : createReservationDto.ReservationStatus,
                TotalPrice = totalPrice,
                TravelDate = travelDate,
                CreatedAt = DateTime.UtcNow,
                NumberOfBlockedSeats = createReservationDto.ReservationStatus == "Blocked" ? createReservationDto.Passengers.Count : null,
                BlockExpirationTime = blockExpirationTime
            };

            _context.Reservations.Add(reservation);

            // Deduct seats
            allocation.AvailableSeats -= createReservationDto.Passengers.Count;

            // Add passengers regardless of ReservationStatus
            var passengers = createReservationDto.Passengers.Select(p => new Passenger
            {
                PassengerId = Guid.NewGuid(),
                ReservationId = reservation.ReservationId,
                FirstName = p.FirstName,
                LastName = p.LastName,
                Gender = p.Gender,
                Email = p.Email,
                PhoneNumber = p.PhoneNumber,
                TicketCode = GenerateTicketCode(),
                TicketPrice = _pricingService.CalculateDynamicPrice(
                    flight.BasePrice,
                    allocation.SeatClass.BasePriceMultiplier,
                    priceMultiplier)
            }).ToList();

            _context.Passengers.AddRange(passengers);

            // Save changes
            await _context.SaveChangesAsync();

            // Map to DTO
            var reservationDto = new ReservationDTO
            {
                ReservationCode = reservation.ReservationCode,
                UserId = reservation.UserId,
                FlightId = reservation.FlightId,
                AllocationId = reservation.AllocationId,
                ReservationStatus = reservation.ReservationStatus,
                TotalPrice = reservation.TotalPrice,
                TravelDate = reservation.TravelDate,
                CreatedAt = reservation.CreatedAt,
                NumberOfBlockedSeats = reservation.NumberOfBlockedSeats
            };

            // Return confirmation
            return CreatedAtAction(nameof(GetReservationByCode), new { code = reservationDto.ReservationCode }, reservationDto);
        }

        private string GenerateTicketCode()
        {
            string code;
            var random = new Random();

            do
            {
                code = random.Next(100000000, 999999999).ToString() + random.Next(1000, 9999).ToString(); // 12 digits
            }
            while (_context.Passengers.Any(p => p.TicketCode == code));

            return code;
        }

        private string GenerateReservationCode()
        {
            string code;
            var random = new Random();

            do
            {
                // Generate a 9-digit random number
                code = random.Next(100000000, 999999999).ToString();
            }
            while (_context.Reservations.Any(r => r.ReservationCode == code));

            return code;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutReservation(Guid id, ReservationUpdateDTO updateDto)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null)
            {
                return NotFound("Reservation not found.");
            }

            // Prevent updates if the reservation is already cancelled
            if (reservation.ReservationStatus == "Cancelled")
            {
                return BadRequest("Cannot update a cancelled reservation.");
            }

            var allocation = await _context.FlightSeatAllocation.FindAsync(reservation.AllocationId);
            if (allocation == null)
            {
                return BadRequest("Invalid seat allocation.");
            }

            // Validate and update ReservationStatus
            if (!string.IsNullOrEmpty(updateDto.ReservationStatus))
            {
                if (reservation.ReservationStatus == "Blocked")
                {
                    if (updateDto.ReservationStatus == "Confirmed" || updateDto.ReservationStatus == "Cancelled")
                    {
                        reservation.ReservationStatus = updateDto.ReservationStatus;

                        if (updateDto.ReservationStatus == "Cancelled")
                        {
                            var passengers = _context.Passengers.Where(p => p.ReservationId == reservation.ReservationId).ToList();
                            allocation.AvailableSeats += passengers.Count;
                            _context.Passengers.RemoveRange(passengers);
                        }
                    }
                    else
                    {
                        return BadRequest("Blocked reservations can only be Confirmed or Cancelled.");
                    }
                }
                else if (reservation.ReservationStatus == "Confirmed")
                {
                    if (updateDto.ReservationStatus == "Cancelled")
                    {
                        reservation.ReservationStatus = "Cancelled";
                        var passengers = _context.Passengers.Where(p => p.ReservationId == reservation.ReservationId).ToList();
                        allocation.AvailableSeats += passengers.Count;
                        _context.Passengers.RemoveRange(passengers);
                    }
                    else
                    {
                        return BadRequest("Confirmed reservations can only be Cancelled.");
                    }
                }
                else
                {
                    return BadRequest("Invalid ReservationStatus transition.");
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReservationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        private bool ReservationExists(Guid id)
        {
            return _context.Reservations.Any(e => e.ReservationId == id);
        }

        // DELETE: api/Reservations/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(Guid id)
        {
            // // Retrieve the reservation
            // var reservation = await _context.Reservations.FindAsync(id);
            // if (reservation == null)
            // {
            //     return NotFound("The reservation was not found.");
            // }

            // // Prevent deletion of already Cancelled reservations
            // if (reservation.ReservationStatus == "Cancelled")
            // {
            //     return BadRequest("Cancelled reservations cannot be deleted. Please create a new reservation if needed.");
            // }

            // // Restore seats in FlightSeatAllocation
            // var allocation = await _context.FlightSeatAllocation.FindAsync(reservation.AllocationId);
            // if (allocation != null && reservation.NumberOfBlockedSeats.HasValue)
            // {
            //     allocation.AvailableSeats += reservation.NumberOfBlockedSeats.Value;
            // }

            // // Remove the reservation
            // _context.Reservations.Remove(reservation);
            // await _context.SaveChangesAsync();

            // // Return success message with details
            // return Ok(new
            // {
            //     Message = "Reservation successfully deleted.",
            //     ReservationId = reservation.ReservationId,
            //     SeatsRestored = reservation.NumberOfBlockedSeats ?? 0
            // });

            return BadRequest("Deleting reservations is not allowed.");
        }

    }

}