using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ARS_API.DTOs;
using ARS_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ARS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeatClassController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public SeatClassController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: api/SeatClass
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SeatClass>>> GetSeatClasses()
        {
            return await _context.SeatClasses.ToListAsync();
        }

        // GET: api/SeatClass/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<SeatClass>> GetSeatClass(Guid id)
        {
            var seatClass = await _context.SeatClasses.FindAsync(id);

            if (seatClass == null)
            {
                return NotFound();
            }

            return seatClass;
        }

        // GET: api/SeatClass/multiplier
        [HttpGet("multiplier")]
        public async Task<ActionResult<decimal>> GetBasePriceMultiplier([FromQuery] Guid airlineId, [FromQuery] string className)
        {
            var seatClass = await _context.SeatClasses
                .FirstOrDefaultAsync(sc => sc.AirlineId == airlineId && sc.ClassName == className);

            if (seatClass == null)
            {
                return NotFound("Seat class not found.");
            }

            return Ok(seatClass.BasePriceMultiplier);
        }

        // GET: api/SeatClass/GetAllocationId
        [HttpGet("GetAllocationId")]
        public async Task<ActionResult<Guid>> GetAllocationId(Guid flightId, Guid airlineId, string className)
        {
            var seatClass = await _context.SeatClasses
                .FirstOrDefaultAsync(sc => sc.AirlineId == airlineId && sc.ClassName == className);

            if (seatClass == null)
            {
                return BadRequest("Invalid seat class.");
            }

            var seatAllocation = await _context.FlightSeatAllocation
                .FirstOrDefaultAsync(fsa => fsa.ClassId == seatClass.ClassId && fsa.FlightId == flightId);

            if (seatAllocation == null)
            {
                return BadRequest("No seat allocation found for this class and flight.");
            }

            return Ok(seatAllocation.AllocationId);
        }

        // GET: api/SeatClass/GetClassNameByFlightAndAllocation
        [HttpGet("GetClassNameByFlightAndAllocation")]
        public async Task<ActionResult<string>> GetClassNameByFlightAndAllocation(Guid flightId, Guid allocationId)
        {
            // Find the seat allocation for the given flightId and allocationId
            var seatAllocation = await _context.FlightSeatAllocation
                .FirstOrDefaultAsync(fsa => fsa.FlightId == flightId && fsa.AllocationId == allocationId);

            if (seatAllocation == null)
            {
                return BadRequest("No seat allocation found for this flight and allocation.");
            }

            // Find the seat class using the ClassId from the seat allocation
            var seatClass = await _context.SeatClasses
                .FirstOrDefaultAsync(sc => sc.ClassId == seatAllocation.ClassId);

            if (seatClass == null)
            {
                return NotFound("Seat class not found.");
            }

            // Return the ClassName
            return Ok(new { ClassName = seatClass.ClassName });
        }

        // POST: api/SeatClass
        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<SeatClass>> PostSeatClass(SeatClass seatClass)
        {
            seatClass.ClassId = Guid.NewGuid();
            _context.SeatClasses.Add(seatClass);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSeatClass), new { id = seatClass.ClassId }, seatClass);
        }

        // PUT: api/SeatClass/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> PutSeatClass(Guid id, UpdateSeatClassDto updateDto)
        {
            // Retrieve the existing SeatClass from the database
            var seatClass = await _context.SeatClasses.FindAsync(id);
            if (seatClass == null)
            {
                return NotFound();
            }

            // Update only the provided fields
            if (!string.IsNullOrEmpty(updateDto.ClassName))
            {
                seatClass.ClassName = updateDto.ClassName;
            }

            if (updateDto.LuggageAllowance.HasValue)
            {
                seatClass.LuggageAllowance = updateDto.LuggageAllowance.Value;
            }

            if (updateDto.BasePriceMultiplier.HasValue)
            {
                seatClass.BasePriceMultiplier = updateDto.BasePriceMultiplier.Value;
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SeatClassExists(id))
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

        // DELETE: api/SeatClass/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteSeatClass(Guid id)
        {
            var seatClass = await _context.SeatClasses.FindAsync(id);
            if (seatClass == null)
            {
                return NotFound();
            }

            _context.SeatClasses.Remove(seatClass);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SeatClassExists(Guid id)
        {
            return _context.SeatClasses.Any(e => e.ClassId == id);
        }
    }
}