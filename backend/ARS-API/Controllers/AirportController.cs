using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ARS_API.Models;
using Microsoft.EntityFrameworkCore;
using ARS_API.DTOs;
using Microsoft.Data.SqlClient;
using Dapper;

namespace ARS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AirportController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDBContext _context;

        public AirportController(IConfiguration configuration, ApplicationDBContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<AirportDTO>>> SearchAirports([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Query parameter is required.");

            var sql = @"
                    SELECT 
                        a.AirportId,
                        a.AirportName,
                        a.AirportCode,
                        c.CityName,
                        c.Country
                    FROM Airports a
                    INNER JOIN Cities c ON a.CityId = c.CityId
                    WHERE 
                        a.AirportCode LIKE @Query OR
                        a.AirportName LIKE @Query OR
                        c.CityName LIKE @Query";

            using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            var airports = await connection.QueryAsync<AirportDTO>(sql, new { Query = $"%{query}%" });

            return Ok(airports);
        }

        // GET: api/Airport
        [HttpGet]
        public async Task<IActionResult> GetAllAirports()
        {
            var airports = await _context.Airports.Include(a => a.City).ToListAsync();
            return Ok(airports);
        }

        // GET: api/Airport/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAirportById(Guid id)
        {
            var airport = await _context.Airports.Include(a => a.City).FirstOrDefaultAsync(a => a.AirportId == id);
            if (airport == null)
                return NotFound();

            return Ok(airport);
        }

        // POST: api/Airport
        [HttpPost]
        public async Task<IActionResult> CreateAirport([FromBody] Airport airport)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            airport.AirportId = Guid.NewGuid();
            _context.Airports.Add(airport);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAirportById), new { id = airport.AirportId }, airport);
        }

        // PUT: api/Airport/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAirport(Guid id, [FromBody] Airport airport)
        {
            if (id != airport.AirportId)
                return BadRequest("Airport ID mismatch");

            _context.Entry(airport).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Airport/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAirport(Guid id)
        {
            var airport = await _context.Airports.FindAsync(id);
            if (airport == null)
                return NotFound();

            _context.Airports.Remove(airport);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }

}
