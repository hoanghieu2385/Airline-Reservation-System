using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using ARS_API.DTOs;
using ARS_API.Models;
using Microsoft.AspNetCore.Authorization;
using ARS_API.Services;

namespace ARS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly PricingService _pricingService;

        public FlightController(ApplicationDBContext context, PricingService pricingService)
        {
            _context = context;
            _pricingService = pricingService;
        }

        // GET: api/Flight
        [HttpGet]
        public async Task<IActionResult> GetAllFlights()
        {
            var flights = await _context.Flights
                .Include(f => f.Airline)
                .Include(f => f.OriginAirport)
                .Include(f => f.DestinationAirport)
                .Include(f => f.FlightSeatAllocations) // Include seat allocations
                .ThenInclude(fsa => fsa.SeatClass)     // Include seat class details
                .Select(f => new FlightDTO
                {
                    FlightId = f.FlightId,
                    FlightNumber = f.FlightNumber,
                    AirlineName = f.Airline.AirlineName,
                    OriginAirportName = f.OriginAirport.AirportName,
                    DestinationAirportName = f.DestinationAirport.AirportName,
                    DepartureTime = f.DepartureTime,
                    ArrivalTime = f.ArrivalTime,
                    Duration = f.Duration,
                    TotalSeats = f.TotalSeats,
                    BasePrice = f.BasePrice,
                    Status = f.Status,
                    SeatAllocations = f.FlightSeatAllocations.Select(fsa => new FlightSeatAllocationDTO
                    {
                        ClassName = fsa.SeatClass.ClassName,
                        AvailableSeats = fsa.AvailableSeats
                    }).ToList()
                })
                .ToListAsync();

            return Ok(flights);
        }

        // GET: api/Flight/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFlightById(Guid id)
        {
            var flight = await _context.Flights
                .Include(f => f.Airline)
                .Include(f => f.OriginAirport)
                .Include(f => f.DestinationAirport)
                .Include(f => f.FlightSeatAllocations) // Include seat allocations
                .ThenInclude(fsa => fsa.SeatClass)     // Include seat class details
                .Where(f => f.FlightId == id)
                .Select(f => new FlightDTO
                {
                    FlightId = f.FlightId,
                    FlightNumber = f.FlightNumber,
                    AirlineId = f.AirlineId,
                    AirlineName = f.Airline.AirlineName,
                    OriginAirportName = f.OriginAirport.AirportName,
                    DestinationAirportName = f.DestinationAirport.AirportName,
                    DepartureTime = f.DepartureTime,
                    ArrivalTime = f.ArrivalTime,
                    Duration = f.Duration,
                    TotalSeats = f.TotalSeats,
                    BasePrice = f.BasePrice,
                    Status = f.Status,
                    SeatAllocations = f.FlightSeatAllocations.Select(fsa => new FlightSeatAllocationDTO
                    {
                        ClassName = fsa.SeatClass.ClassName,
                        AvailableSeats = fsa.AvailableSeats
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (flight == null) return NotFound();

            return Ok(flight);
        }

        // GET: api/Flights/Search
        [HttpGet("Search")]
        public async Task<IActionResult> SearchFlights(
            [FromQuery] Guid from,
            [FromQuery] Guid to,
            [FromQuery] DateTime date,
            [FromQuery] int passengers,
            [FromQuery] string seatClass)

        {
            var searchDate = DateTime.UtcNow;

            var flights = await _context.Flights
                .Include(f => f.Airline)
                .Include(f => f.OriginAirport)
                .Include(f => f.DestinationAirport)
                .Include(f => f.FlightSeatAllocations)
                .ThenInclude(fsa => fsa.SeatClass)
                .Where(f => f.OriginAirportId == from
                            && f.DestinationAirportId == to
                            && f.DepartureTime.Date == date.Date
                            && f.FlightSeatAllocations.Any(fsa => fsa.SeatClass.ClassName == seatClass && fsa.AvailableSeats >= passengers))
                .Select(f => new
                {
                    Flight = f,
                    DaysBeforeDeparture = (f.DepartureTime - searchDate).Days,
                    SeatAllocation = f.FlightSeatAllocations.FirstOrDefault(fsa => fsa.SeatClass.ClassName == seatClass)
                })
                .ToListAsync();

            if (!flights.Any())
            {
                return NotFound("No flights found matching the criteria.");
            }

            var result = flights.Select(f => new FlightSearchResultDTO
            {
                FlightId = f.Flight.FlightId,
                FlightNumber = f.Flight.FlightNumber,
                AirlineName = f.Flight.Airline.AirlineName,
                OriginAirportCode = f.Flight.OriginAirport.AirportCode,
                DepartureTime = f.Flight.DepartureTime,
                DestinationAirportCode = f.Flight.DestinationAirport.AirportCode,
                ArrivalTime = f.Flight.ArrivalTime,
                DynamicPrice = _pricingService.CalculateDynamicPrice(
                    f.Flight.BasePrice,
                    f.SeatAllocation.SeatClass.BasePriceMultiplier,
                    _pricingService.GetPriceMultiplierAsync(f.DaysBeforeDeparture).Result), // Simplified async handling
                SeatClass = f.SeatAllocation.SeatClass.ClassName,
                AvailableSeats = f.SeatAllocation.AvailableSeats,
                AllocationId = f.SeatAllocation.AllocationId
            }).ToList();

            return Ok(result);
        }

        // POST: api/Flight
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CreateFlight([FromBody] CreateFlightDto flightDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Step 1: Validate Airline
            var airline = await _context.Airlines.FindAsync(flightDto.AirlineId);
            if (airline == null)
                return BadRequest("Invalid AirlineId.");

            // Step 2: Fetch SeatClasses for the Airline
            var seatClasses = await _context.SeatClasses
                .Where(sc => sc.AirlineId == flightDto.AirlineId)
                .ToListAsync();

            if (!seatClasses.Any())
                return BadRequest("No seat classes found for the specified airline.");

            // Step 3: Validate Seat Allocations (if provided)
            if (flightDto.SeatAllocations != null)
            {
                var totalAllocatedSeats = flightDto.SeatAllocations.Sum(sa => sa.AvailableSeats);
                if (totalAllocatedSeats != flightDto.TotalSeats)
                {
                    return BadRequest("The total of all seat allocations must match the TotalSeats for the flight.");
                }
            }
            else
            {
                return BadRequest("Seat allocations are required.");
            }

            // Step 4: Create Flight
            var flight = new Flight
            {
                FlightId = Guid.NewGuid(),
                FlightNumber = flightDto.FlightNumber,
                AirlineId = flightDto.AirlineId,
                OriginAirportId = flightDto.OriginAirportId,
                DestinationAirportId = flightDto.DestinationAirportId,
                DepartureTime = flightDto.DepartureTime,
                ArrivalTime = flightDto.ArrivalTime,
                Duration = flightDto.Duration,
                TotalSeats = flightDto.TotalSeats,
                BasePrice = flightDto.BasePrice,
                Status = flightDto.Status
            };

            _context.Flights.Add(flight);
            await _context.SaveChangesAsync();

            // Step 5: Map SeatAllocations to FlightSeatAllocation
            var seatAllocations = flightDto.SeatAllocations.Select(sa =>
            {
                var seatClass = seatClasses.FirstOrDefault(sc => sc.ClassName == sa.ClassName);
                if (seatClass == null)
                    throw new Exception($"Seat class '{sa.ClassName}' does not exist for this airline.");

                return new FlightSeatAllocation
                {
                    AllocationId = Guid.NewGuid(),
                    FlightId = flight.FlightId,
                    ClassId = seatClass.ClassId,
                    AvailableSeats = sa.AvailableSeats
                };
            }).ToList();

            _context.FlightSeatAllocation.AddRange(seatAllocations);
            await _context.SaveChangesAsync();

            // Return response
            return CreatedAtAction(nameof(GetFlightById), new { id = flight.FlightId }, new
            {
                Flight = flight,
                SeatAllocations = seatAllocations.Select(sa => new
                {
                    sa.ClassId,
                    sa.AvailableSeats
                })
            });
        }

        // PUT: api/Flight/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateFlight(Guid id, [FromBody] UpdateFlightDto updateFlightDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var flight = await _context.Flights.FindAsync(id);
            if (flight == null) return NotFound();

            // Check if DepartureTime has changed
            bool departureTimeChanged = flight.DepartureTime != updateFlightDto.DepartureTime;

            // Update flight details
            flight.DepartureTime = updateFlightDto.DepartureTime;
            flight.ArrivalTime = updateFlightDto.ArrivalTime;
            flight.Status = updateFlightDto.Status;

            _context.Flights.Update(flight);

            // Automatically update TravelDate in Reservations if DepartureTime has changed
            if (departureTimeChanged)
            {
                var reservations = _context.Reservations.Where(r => r.FlightId == id).ToList();
                foreach (var reservation in reservations)
                {
                    reservation.TravelDate = flight.DepartureTime;
                }
            }

            // Save changes to both Flights and Reservations
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Flight/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteFlight(Guid id)
        {
            var flight = await _context.Flights.FindAsync(id);
            if (flight == null) return NotFound();

            _context.Flights.Remove(flight);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
