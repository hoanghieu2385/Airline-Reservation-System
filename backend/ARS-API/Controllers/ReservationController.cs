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

            // Fetch the flight to get the BasePrice
            var flight = await _context.Flights.FindAsync(createReservationDto.FlightId);
            if (flight == null)
            {
                return BadRequest("Invalid flight ID.");
            }

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
                ReservationStatus = createReservationDto.ReservationStatus,
                TotalPrice = totalPrice,
                TravelDate = createReservationDto.TravelDate,
                NumberOfBlockedSeats = createReservationDto.NumberOfBlockedSeats,
                CreatedAt = DateTime.UtcNow
            };

            // Deduct seats
            allocation.AvailableSeats -= createReservationDto.NumberOfBlockedSeats ?? 0;

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetReservationByCode), new { code = reservation.ReservationCode }, reservation);
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

        // PUT: api/Reservations/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReservation(Guid id, ReservationDTO reservationDto)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null)
            {
                return NotFound();
            }

            // Update fields (e.g., status or blocked seats)
            if (reservationDto.NumberOfBlockedSeats.HasValue)
            {
                var allocation = await _context.FlightSeatAllocation.FindAsync(reservation.AllocationId);
                if (allocation == null || allocation.AvailableSeats + reservation.NumberOfBlockedSeats < reservationDto.NumberOfBlockedSeats)
                {
                    return BadRequest("Invalid seat allocation or insufficient seats.");
                }

                // Adjust seat counts
                allocation.AvailableSeats += reservation.NumberOfBlockedSeats ?? 0;
                allocation.AvailableSeats -= reservationDto.NumberOfBlockedSeats.Value;

                reservation.NumberOfBlockedSeats = reservationDto.NumberOfBlockedSeats;
            }

            reservation.ReservationStatus = "Updated"; // Example status update
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Reservations/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReservation(Guid id)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null)
            {
                return NotFound();
            }

            // Restore seats
            var allocation = await _context.FlightSeatAllocation.FindAsync(reservation.AllocationId);
            if (allocation != null)
            {
                allocation.AvailableSeats += reservation.NumberOfBlockedSeats ?? 0;
            }

            _context.Reservations.Remove(reservation);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

}