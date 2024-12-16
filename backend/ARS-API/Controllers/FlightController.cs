using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using ARS_API.DTOs;
using ARS_API.Models;

namespace ARS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FlightController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public FlightController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: api/Flight
        [HttpGet]
        public async Task<IActionResult> GetAllFlights()
        {
            var flights = await _context.Flights
                .Include(f => f.Airline)
                .Include(f => f.OriginAirport)
                .Include(f => f.DestinationAirport)
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
                    Status = f.Status
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
                .Where(f => f.FlightId == id)
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
                    Status = f.Status
                })
                .FirstOrDefaultAsync();

            if (flight == null) return NotFound();

            return Ok(flight);
        }

        // POST: api/Flight
        [HttpPost]
        public async Task<IActionResult> CreateFlight([FromBody] CreateFlightDto flightDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

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

            return CreatedAtAction(nameof(GetFlightById), new { id = flight.FlightId }, flight);
        }

        // PUT: api/Flight/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFlight(Guid id, [FromBody] UpdateFlightDto updateFlightDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var flight = await _context.Flights.FindAsync(id);
            if (flight == null) return NotFound();

            flight.DepartureTime = updateFlightDto.DepartureTime;
            flight.ArrivalTime = updateFlightDto.ArrivalTime;
            flight.Status = updateFlightDto.Status;

            _context.Flights.Update(flight);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Flight/{id}
        [HttpDelete("{id}")]
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
