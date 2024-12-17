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
    public class CityController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public CityController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: api/City
        [HttpGet]
        public async Task<IActionResult> GetAllCities()
        {
            var cities = await _context.Cities.ToListAsync();
            return Ok(cities);
        }

        // GET: api/City/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCityById(Guid id)
        {
            var city = await _context.Cities.FindAsync(id);
            if (city == null)
                return NotFound();

            return Ok(city);
        }

        // POST: api/City
        [HttpPost]
        public async Task<IActionResult> CreateCity([FromBody] City city)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            city.CityId = Guid.NewGuid();
            _context.Cities.Add(city);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCityById), new { id = city.CityId }, city);
        }

        // PUT: api/City/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCity(Guid id, [FromBody] City city)
        {
            if (id != city.CityId)
                return BadRequest("City ID mismatch");

            _context.Entry(city).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/City/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCity(Guid id)
        {
            var city = await _context.Cities.FindAsync(id);
            if (city == null)
                return NotFound();

            _context.Cities.Remove(city);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

}