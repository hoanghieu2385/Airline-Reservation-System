using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ARS_API.Models;
using ARS_API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ARS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReservationsController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public ReservationsController(ApplicationDBContext context)
        {
            _context = context;
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
            var allocation = await _context.FlightSeatAllocation.FindAsync(createReservationDto.AllocationId);
            if (allocation == null || allocation.AvailableSeats < createReservationDto.NumberOfBlockedSeats)
            {
                return BadRequest("Invalid seat allocation or insufficient seats.");
            }

            // Fetch the flight to get the BasePrice and DepartureTime
            var flight = await _context.Flights.FindAsync(createReservationDto.FlightId);
            if (flight == null)
            {
                return BadRequest("Invalid flight ID.");
            }

            // Automatically set TravelDate to the flight's DepartureTime
            var travelDate = flight.DepartureTime;

            // Calculate TotalPrice (BasePrice * NumberOfBlockedSeats)
            var totalPrice = flight.BasePrice * createReservationDto.NumberOfBlockedSeats ?? 0;

            // Create a new reservation
            var reservation = new Reservation
            {
                ReservationId = Guid.NewGuid(),
                ReservationCode = GenerateReservationCode(),
                UserId = createReservationDto.UserId,
                FlightId = createReservationDto.FlightId,
                AllocationId = createReservationDto.AllocationId,
                ReservationStatus = createReservationDto.ReservationStatus ?? "Blocked", // Default is "Blocked"
                TotalPrice = totalPrice,
                TravelDate = travelDate,
                NumberOfBlockedSeats = createReservationDto.NumberOfBlockedSeats,
                CreatedAt = DateTime.UtcNow
            };

            // Deduct seats
            allocation.AvailableSeats -= createReservationDto.NumberOfBlockedSeats ?? 0;

            // Add passengers if ReservationStatus is "Confirmed"
            if (createReservationDto.ReservationStatus == "Confirmed" && createReservationDto.Passengers != null)
            {
                foreach (var passengerDto in createReservationDto.Passengers)
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

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

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

                    // TODO: TotalPrice will be calculated based on Passengers, BasePriceMultiplier and PriceMultiplier
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