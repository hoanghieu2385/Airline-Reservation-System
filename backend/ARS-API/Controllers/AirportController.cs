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

        public AirportController(IConfiguration configuration)
        {
            _configuration = configuration;
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
            c.CityName LIKE @Query";

            using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
            var airports = await connection.QueryAsync<AirportDTO>(sql, new { Query = $"%{query}%" });

            return Ok(airports);
        }

    }

}
