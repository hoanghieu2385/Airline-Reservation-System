using System;
using System.Linq;
using System.Threading.Tasks;
using ARS_API.Data;
using ARS_API.Models;
using ARS_API.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

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
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not authenticated." });
                }

                var confirmedReservations = await _context.Reservations
                    .Include(r => r.Flight)
                    .Where(r => r.UserId == userId && r.ReservationStatus == "Confirmed")
                    .ToListAsync();

                if (!confirmedReservations.Any())
                {
                    return NotFound(new { message = "No confirmed reservations found for the user." });
                }

                var totalDistance = 0;

                foreach (var reservation in confirmedReservations)
                {
                    var flightRoute = await _context.Routes
                        .FirstOrDefaultAsync(fr =>
                            fr.OriginAirportId == reservation.Flight.OriginAirportId &&
                            fr.DestinationAirportId == reservation.Flight.DestinationAirportId);

                    if (flightRoute != null)
                    {
                        totalDistance += flightRoute.Distance;
                    }
                }

                return Ok(new
                {
                    TotalDistance = totalDistance,
                    Message = "Total flight distance for confirmed reservations calculated successfully."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while calculating flight distances.", error = ex.Message });
            }
        }

        // CRUD operations for flight routes

        // GET: api/FlightRoute
        [HttpGet]
        public async Task<IActionResult> GetAllRoutes()
        {
            var routes = await _context.Routes
                .Include(r => r.OriginAirport)
                .Include(r => r.DestinationAirport)
                .Select(r => new FlightRouteDTO
                {
                    FlightRouteId = r.FlightRouteId,
                    OriginAirportName = r.OriginAirport.AirportName,
                    DestinationAirportName = r.DestinationAirport.AirportName,
                    Distance = r.Distance
                })
                .ToListAsync();

            return Ok(routes);
        }

        // GET: api/FlightRoute/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRouteById(Guid id)
        {
            var route = await _context.Routes
                .Include(r => r.OriginAirport)
                .Include(r => r.DestinationAirport)
                .Where(r => r.FlightRouteId == id)
                .Select(r => new FlightRoutelDTO
                {
                    FlightRouteId = r.FlightRouteId,
                    OriginAirportName = r.OriginAirport.AirportName,
                    DestinationAirportName = r.DestinationAirport.AirportName,
                    Distance = r.Distance
                })
                .FirstOrDefaultAsync();

            if (route == null)
                return NotFound(new { message = "Flight route not found." });

            return Ok(route);
        }


        // POST: api/FlightRoute
        [HttpPost]
        public async Task<IActionResult> CreateRoute([FromBody] CreateRouteDTO routeDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var originExists = await _context.Airports.AnyAsync(a => a.AirportId == routeDto.OriginAirportId);
            var destinationExists = await _context.Airports.AnyAsync(a => a.AirportId == routeDto.DestinationAirportId);

            if (!originExists || !destinationExists)
                return BadRequest(new { message = "One or both airports do not exist." });

            var existingRoute = await _context.Routes.FirstOrDefaultAsync(r =>
                r.OriginAirportId == routeDto.OriginAirportId &&
                r.DestinationAirportId == routeDto.DestinationAirportId);

            if (existingRoute != null)
                return BadRequest(new { message = "Route already exists." });

            var route = new FlightRoute
            {
                FlightRouteId = Guid.NewGuid(),
                OriginAirportId = routeDto.OriginAirportId,
                DestinationAirportId = routeDto.DestinationAirportId,
                Distance = routeDto.Distance
            };

            _context.Routes.Add(route);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRouteById), new { id = route.FlightRouteId }, route);
        }

        // PUT: api/FlightRoute/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoute(Guid id, [FromBody] UpdateRouteDTO routeDto)
        {
            if (id != routeDto.RouteId)
                return BadRequest(new { message = "Route ID mismatch." });

            var route = await _context.Routes.FindAsync(id);
            if (route == null)
                return NotFound(new { message = "Flight route not found." });

            var originExists = await _context.Airports.AnyAsync(a => a.AirportId == routeDto.OriginAirportId);
            var destinationExists = await _context.Airports.AnyAsync(a => a.AirportId == routeDto.DestinationAirportId);

            if (!originExists || !destinationExists)
                return BadRequest(new { message = "One or both airports do not exist." });

            route.OriginAirportId = routeDto.OriginAirportId;
            route.DestinationAirportId = routeDto.DestinationAirportId;
            route.Distance = routeDto.Distance;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the route.", error = ex.Message });
            }
        }

        // DELETE: api/FlightRoute/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoute(Guid id)
        {
            var route = await _context.Routes.FindAsync(id);
            if (route == null)
                return NotFound(new { message = "Flight route not found." });

            _context.Routes.Remove(route);

            try
            {
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the route.", error = ex.Message });
            }
        }
    }
}