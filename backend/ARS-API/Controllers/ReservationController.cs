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

        public ReservationsController(ApplicationDBContext context, PricingService pricingService)
        {
            _context = context;
            _pricingService = pricingService;
        }

        // GET: api/Reservations
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reservation>>> GetReservations()
        {
            return await _context.Reservations.ToListAsync();
        }

        // GET: api/Reservations/{code}
        [HttpGet("{code}")]
        public async Task<ActionResult<Reservation>> GetReservationByCode(string code)
        {
            var reservation = await _context.Reservations
                                .FirstOrDefaultAsync(r => r.ReservationCode == code);

            if (reservation == null)
            {
                return NotFound();
            }

            return reservation;
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
            var flight = await _context.Flights.FindAsync(createReservationDto.FlightId);
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
                Age = p.Age,
                Gender = p.Gender,
                TicketCode = GenerateTicketCode(),
                TicketPrice = _pricingService.CalculateDynamicPrice(
                    flight.BasePrice,
                    allocation.SeatClass.BasePriceMultiplier,
                    priceMultiplier)
            }).ToList();

            _context.Passengers.AddRange(passengers);

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
            var allocation = await _context.FlightSeatAllocation.FindAsync(createReservationDto.AllocationId);
            if (allocation == null || allocation.AvailableSeats < createReservationDto.Passengers.Count)
            {
                return BadRequest("Invalid seat allocation or insufficient seats.");
            }

            // Validate flight
            var flight = await _context.Flights.FindAsync(createReservationDto.FlightId);
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
                ReservationStatus = createReservationDto.ReservationStatus,
                TotalPrice = totalPrice,
                TravelDate = travelDate,
                CreatedAt = DateTime.UtcNow,
                NumberOfBlockedSeats = createReservationDto.ReservationStatus == "Blocked" ? createReservationDto.Passengers.Count : null,
                BlockExpirationTime = blockExpirationTime // New column in the Reservations table
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
                Age = p.Age,
                Gender = p.Gender,
                TicketCode = GenerateTicketCode(),
                TicketPrice = _pricingService.CalculateDynamicPrice(
                    flight.BasePrice,
                    allocation.SeatClass.BasePriceMultiplier,
                    priceMultiplier)
            }).ToList();

            _context.Passengers.AddRange(passengers);

            // Save changes
            await _context.SaveChangesAsync();

            // Return confirmation
            return CreatedAtAction(nameof(GetReservationByCode), new { code = reservation.ReservationCode }, reservation);
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
            // Retrieve existing reservation
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null)
            {
                return NotFound();
            }

            // Prevent updates if the reservation is already Cancelled
            if (reservation.ReservationStatus == "Cancelled")
            {
                return BadRequest("Cannot update a cancelled reservation. Please create a new one.");
            }

            // Retrieve seat allocation and flight details
            var allocation = await _context.FlightSeatAllocation.FindAsync(reservation.AllocationId);
            var flight = await _context.Flights.FindAsync(reservation.FlightId);

            if (allocation == null || flight == null)
            {
                return BadRequest("Invalid seat allocation or flight.");
            }

            // 1. Update ReservationStatus
            if (!string.IsNullOrEmpty(updateDto.ReservationStatus))
            {
                if (reservation.ReservationStatus == "Blocked" &&
                    (updateDto.ReservationStatus == "Confirmed" || updateDto.ReservationStatus == "Cancelled"))
                {
                    // TODO: if Status is changed to "Confirmed", NumberOfSeatsBlocked should be nullified (back to 0), seats will then be accounted for via Passengers
                    reservation.ReservationStatus = updateDto.ReservationStatus;

                    if (updateDto.ReservationStatus == "Confirmed")
                    {
                        // Nullify NumberOfBlockedSeats as seats will be accounted for via Passengers
                        allocation.AvailableSeats += reservation.NumberOfBlockedSeats ?? 0;
                        reservation.NumberOfBlockedSeats = 0;

                        // Automatically add passengers
                        if (updateDto.Passengers != null)
                        {
                            foreach (var passengerDto in updateDto.Passengers)
                            {
                                var passenger = new Passenger
                                {
                                    PassengerId = Guid.NewGuid(),
                                    ReservationId = reservation.ReservationId,
                                    FirstName = passengerDto.FirstName,
                                    LastName = passengerDto.LastName,
                                    Age = passengerDto.Age,
                                    Gender = passengerDto.Gender,
                                    TicketCode = GenerateTicketCode(),
                                    // TODO: Adjust TicketPRice accordingly to line 245
                                    TicketPrice = flight.BasePrice
                                };

                                _context.Passengers.Add(passenger);
                            }
                        }
                        else
                        {
                            return BadRequest("Passengers must be provided when confirming a reservation.");
                        }
                    }

                    if (updateDto.ReservationStatus == "Cancelled")
                    {
                        // Nullify blocked seats and restore availability
                        allocation.AvailableSeats += reservation.NumberOfBlockedSeats ?? 0;
                        reservation.NumberOfBlockedSeats = 0;
                    }
                }
                else if (reservation.ReservationStatus == "Confirmed" && updateDto.ReservationStatus == "Cancelled")
                {
                    reservation.ReservationStatus = "Cancelled";
                    allocation.AvailableSeats += reservation.NumberOfBlockedSeats ?? 0;
                    reservation.NumberOfBlockedSeats = 0;

                    // Remove associated passengers
                    var passengers = _context.Passengers.Where(p => p.ReservationId == reservation.ReservationId).ToList();
                    _context.Passengers.RemoveRange(passengers);
                }
                else
                {
                    return BadRequest("Invalid ReservationStatus change.");
                }
            }

            // 2. Update NumberOfBlockedSeats (only allow lowering the number)
            if (updateDto.NumberOfBlockedSeats.HasValue)
            {
                if (updateDto.NumberOfBlockedSeats.Value < reservation.NumberOfBlockedSeats)
                {
                    int seatDifference = reservation.NumberOfBlockedSeats.Value - updateDto.NumberOfBlockedSeats.Value;

                    allocation.AvailableSeats += seatDifference; // Return seats
                    reservation.NumberOfBlockedSeats = updateDto.NumberOfBlockedSeats;

                    // TODO: TotalPrice will be calculated via BasePrice, Passengers, BasePriceMultiplier and PriceMultiplier
                    reservation.TotalPrice = flight.BasePrice * reservation.NumberOfBlockedSeats.Value;
                }
                else
                {
                    return BadRequest("NumberOfBlockedSeats can only be reduced.");
                }
            }

            // Save changes
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