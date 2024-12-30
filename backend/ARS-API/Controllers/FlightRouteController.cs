using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using ARS_API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ARS_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FlightRouteController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public FlightRouteController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: api/FlightRoute/confirmed-distance
        [HttpGet("confirmed-distance")]
        public async Task<IActionResult> GetTotalConfirmedFlightDistance()
        {
            try
            {
                // Retrieve the user ID from the authenticated user's claims
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated." });
                }

                // Fetch all confirmed reservations for the user
                var confirmedReservations = await _context.Reservations
                    .Include(r => r.Flight) // Include Flight details
                    .Where(r => r.UserId == userId && r.ReservationStatus == "Confirmed")
                    .ToListAsync();

                if (!confirmedReservations.Any())
                {
                    return NotFound(new { message = "No confirmed reservations found for the user." });
                }

                // Calculate total distance by summing up flight routes
                var totalDistance = 0;

                foreach (var reservation in confirmedReservations)
                {
                    // Find the matching FlightRoute
                    var flightRoute = await _context.Routes
                        .FirstOrDefaultAsync(fr =>
                            fr.OriginAirportId == reservation.Flight.OriginAirportId &&
                            fr.DestinationAirportId == reservation.Flight.DestinationAirportId);

                    if (flightRoute != null)
                    {
                        totalDistance += flightRoute.Distance;
                    }
                }

                // Return the total distance
                return Ok(new
                {
                    TotalDistance = totalDistance,
                    Message = "Total flight distance for confirmed reservations calculated successfully."
                });
            }
            catch (Exception ex)
            {
                // Handle exceptions gracefully
                return StatusCode(500, new { message = "An error occurred while calculating flight distances.", error = ex.Message });
            }
        }
    }
}