using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        public async Task<IActionResult> CreateAirline([FromBody] Airline airline)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            airline.AirlineId = Guid.NewGuid();
            _context.Airlines.Add(airline);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAirlineById), new { id = airline.AirlineId }, airline);
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