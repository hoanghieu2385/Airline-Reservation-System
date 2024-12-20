using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ARS_API.DTOs;
using ARS_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ARS_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AirlineController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public AirlineController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: api/Airline
        [HttpGet]
        public async Task<IActionResult> GetAllAirlines()
        {
            var airlines = await _context.Airlines.ToListAsync();
            return Ok(airlines);
        }

        // GET: api/Airline/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAirlineById(Guid id)
        {
            var airline = await _context.Airlines.FindAsync(id);
            if (airline == null)
                return NotFound();

            return Ok(airline);
        }

        // POST: api/Airline
        [HttpPost]
        public async Task<IActionResult> CreateAirline([FromBody] CreateAirlineDTO createAirlineDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var airline = new Airline
            {
                AirlineId = Guid.NewGuid(),
                AirlineName = createAirlineDto.AirlineName,
                AirlineCode = createAirlineDto.AirlineCode,
                Country = createAirlineDto.Country,
                LogoUrl = createAirlineDto.LogoUrl,
                ContactNumber = createAirlineDto.ContactNumber,
                WebsiteUrl = createAirlineDto.WebsiteUrl
            };

            _context.Airlines.Add(airline);
            await _context.SaveChangesAsync();

            // Add SeatClasses (if provided) or use defaults
            var seatClasses = createAirlineDto.SeatClasses?.Select(sc => new SeatClass
            {
                ClassId = Guid.NewGuid(),
                AirlineId = airline.AirlineId,
                ClassName = sc.ClassName,
                LuggageAllowance = sc.LuggageAllowance,
                BasePriceMultiplier = sc.BaseMultiplier
            }).ToList()
            ?? new List<SeatClass> // Default classes
            {
                new SeatClass { ClassId = Guid.NewGuid(), AirlineId = airline.AirlineId, ClassName = "Economy", LuggageAllowance = 20, BasePriceMultiplier = 1.0M },
                new SeatClass { ClassId = Guid.NewGuid(), AirlineId = airline.AirlineId, ClassName = "Business", LuggageAllowance = 30, BasePriceMultiplier = 1.5M },
                new SeatClass { ClassId = Guid.NewGuid(), AirlineId = airline.AirlineId, ClassName = "First Class", LuggageAllowance = 40, BasePriceMultiplier = 2.0M }
            };

            _context.SeatClasses.AddRange(seatClasses);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAirlineById), new { id = airline.AirlineId }, new
            {
                airline.AirlineId,
                airline.AirlineName,
                airline.AirlineCode,
                airline.Country,
                airline.LogoUrl,
                airline.ContactNumber,
                airline.WebsiteUrl,
                SeatClasses = seatClasses.Select(sc => new
                {
                    sc.ClassName,
                    sc.LuggageAllowance,
                    sc.BasePriceMultiplier
                })
            });
        }

        // PUT: api/Airline/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAirline(Guid id, [FromBody] Airline airline)
        {
            if (id != airline.AirlineId)
                return BadRequest("Airline ID mismatch");

            _context.Entry(airline).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Airline/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAirline(Guid id)
        {
            var airline = await _context.Airlines.FindAsync(id);
            if (airline == null)
                return NotFound();

            _context.Airlines.Remove(airline);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

}