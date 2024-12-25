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