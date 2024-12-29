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

        public ReservationsController(ApplicationDBContext context, PricingService pricingService, IEmailService emailService)
        {
            _context = context;
            _pricingService = pricingService;
            _emailService = emailService;
        }

        // GET: api/Reservations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReservationDTO>>> GetReservations()
        {
            var reservations = await _context.Reservations
                .Include(r => r.Flight)
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
                    TravelDate = r.TravelDate, // Include the raw TravelDate
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
        [FromQuery] Guid? flightId,
        [FromQuery] bool includeCancelled = false) // New parameter
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
                .OrderByDescending(r => r.CreatedAt) // Sort by CreatedAt in descending order
                .Select(r => new ReservationDTO
                {
                    ReservationId = r.ReservationId,
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
                .ToListAsync();

            if (!reservations.Any())
            {
                return NotFound("No reservations found for the given criteria.");
            }

            return Ok(reservations);
        }

        // POST: api/Reservations
        [HttpPost]
        public async Task<ActionResult<Reservation>> PostReservation(CreateReservationDTO createReservationDto)
        {
            // Validate foreign keys
            var allocation = await _context.FlightSeatAllocation
                .Include(fsa => fsa.SeatClass) // Ensure SeatClass is loaded
                .FirstOrDefaultAsync(fsa => fsa.AllocationId == createReservationDto.AllocationId);

            if (allocation == null || allocation.AvailableSeats < createReservationDto.Passengers?.Count)
            {
                return BadRequest("Invalid seat allocation or insufficient seats.");
            }

            // Validate flight
            var flight = await _context.Flights
                .Include(f => f.OriginAirport)
                .Include(f => f.DestinationAirport)
                .FirstOrDefaultAsync(f => f.FlightId == createReservationDto.FlightId);
            if (flight == null)
            {
                return BadRequest("Invalid flight ID.");
            }

            // Validate passengers
            if (createReservationDto.Passengers == null || !createReservationDto.Passengers.Any())
            {
                return BadRequest("Passenger details must be provided.");
            }

            // Validate seat class
            if (allocation.SeatClass == null)
            {
                return BadRequest("Seat class information is missing or invalid.");
            }

            // Process data and calculate dynamic price
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

            // Create a new reservation
            var reservation = new Reservation
            {
                ReservationId = Guid.NewGuid(),
                ReservationCode = GenerateReservationCode(),
                UserId = createReservationDto.UserId,
                FlightId = createReservationDto.FlightId,
                AllocationId = createReservationDto.AllocationId,
                ReservationStatus = createReservationDto.ReservationStatus ?? "Blocked", // Default to "Blocked"
                TotalPrice = totalPrice,
                TravelDate = travelDate,
                CreatedAt = DateTime.UtcNow,
                NumberOfBlockedSeats = createReservationDto.ReservationStatus == "Blocked" ? createReservationDto.Passengers.Count : null,
                BlockExpirationTime = blockExpirationTime // New column in the Reservations table
            };

            // Deduct seats for "Blocked" or "Confirmed" reservations
            allocation.AvailableSeats -= createReservationDto.Passengers.Count;

            // Add Reservation to the context
            _context.Reservations.Add(reservation);

            // Add passengers for all reservations
            var passengers = createReservationDto.Passengers.Select(p => new Passenger
            {
                PassengerId = Guid.NewGuid(),
                ReservationId = reservation.ReservationId,
                FirstName = p.FirstName,
                LastName = p.LastName,
                Gender = p.Gender,
                TicketCode = GenerateTicketCode(),
                TicketPrice = _pricingService.CalculateDynamicPrice(
                    flight.BasePrice,
                    allocation.SeatClass.BasePriceMultiplier,
                    priceMultiplier)
            }).ToList();

            _context.Passengers.AddRange(passengers);

            // TODO: line 165 nen thay bang TicketCode chu khong phai la ReservationCode
            // string emailBody = $@"
            //     <div style='font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;'>
            //         <h1 style='text-align: center; color: #4CAF50;'>E-Ticket</h1>

            //         <h2 style='color: #4CAF50;'>Passenger Information</h2>
            //         <p><strong>Passenger Name:</strong> {createReservationDto.Passengers.First().FirstName} {createReservationDto.Passengers.First().LastName}</p>
            //         <p><strong>Reservation Code:</strong> {reservation.ReservationCode}</p>
            //         <p><strong>Ticket price:</strong> {totalPrice:C}</p>

            //         <h2 style='color: #4CAF50;'>Flight Details</h2>
            //         <p><strong>Route:</strong> {reservation.Flight.OriginAirport.AirportName} -> {reservation.Flight.DestinationAirport.AirportName}</p>
            //         <p><strong>Departure Time:</strong> {travelDate:dddd, dd MMMM yyyy}</p>
            //         <p><strong>Airline:</strong> {flight.Airline}</p>
            //         <p><strong>Reservation Code:</strong> {reservation.ReservationCode}</p>

            //         <p style='text-align: center; margin-top: 20px;'>We appreciate you trusting and using our Services!</p>
            //     </div>";

            // await _emailService.SendEmailAsync(createReservationDto.Passengers.First().Email, "Flight Reservation Confirmation", emailBody);

            // Save changes
            await _context.SaveChangesAsync();

            // Return confirmation
            return CreatedAtAction(nameof(GetReservationByCode), new { code = reservation.ReservationCode }, reservation);
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

            // Create a new reservation
            var reservation = new Reservation
            {
                ReservationId = Guid.NewGuid(),
                ReservationCode = GenerateReservationCode(),
                UserId = createReservationDto.UserId,
                FlightId = createReservationDto.FlightId,
                AllocationId = createReservationDto.AllocationId,
                ReservationStatus = createReservationDto.ReservationStatus ?? "Blocked", // Default to "Blocked" if not provided
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
                            allocation.AvailableSeats += reservation.NumberOfBlockedSeats ?? 0;
                            var passengers = _context.Passengers.Where(p => p.ReservationId == reservation.ReservationId).ToList();
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
                        allocation.AvailableSeats += reservation.NumberOfBlockedSeats ?? 0;
                        var passengers = _context.Passengers.Where(p => p.ReservationId == reservation.ReservationId).ToList();
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
            // Retrieve the reservation
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null)
            {
                return NotFound("The reservation was not found.");
            }

            // Prevent deletion of already Cancelled reservations
            if (reservation.ReservationStatus == "Cancelled")
            {
                return BadRequest("Cancelled reservations cannot be deleted. Please create a new reservation if needed.");
            }

            // Restore seats in FlightSeatAllocation
            var allocation = await _context.FlightSeatAllocation.FindAsync(reservation.AllocationId);
            if (allocation != null && reservation.NumberOfBlockedSeats.HasValue)
            {
                allocation.AvailableSeats += reservation.NumberOfBlockedSeats.Value;
            }

            // Remove the reservation
            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();

            // Return success message with details
            return Ok(new
            {
                Message = "Reservation successfully deleted.",
                ReservationId = reservation.ReservationId,
                SeatsRestored = reservation.NumberOfBlockedSeats ?? 0
            });
        }

    }

}