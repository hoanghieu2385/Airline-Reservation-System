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
    [Authorize]
    public class PassengerController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public PassengerController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: api/Passenger
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Passenger>>> GetPassengers()
        {
            return await _context.Passengers.ToListAsync();
        }

        // GET: api/Passenger/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Passenger>> GetPassenger(Guid id)
        {
            var passenger = await _context.Passengers.FindAsync(id);
            if (passenger == null)
            {
                return NotFound();
            }

            return passenger;
        }

        // POST: api/Passenger
        [HttpPost]
        public async Task<ActionResult<Passenger>> PostPassenger(CreatePassengerDTO createPassengerDto)
        {
            var passenger = new Passenger
            {
                PassengerId = Guid.NewGuid(),
                FirstName = createPassengerDto.FirstName,
                LastName = createPassengerDto.LastName,
                Gender = createPassengerDto.Gender,
                TicketCode = GenerateTicketCode(),
                Email = createPassengerDto.Email,
                PhoneNumber = createPassengerDto.PhoneNumber
            };

            _context.Passengers.Add(passenger);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPassenger), new { id = passenger.PassengerId }, passenger);
        }


        // PUT: api/Passenger/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPassenger(Guid id, UpdatePassengerDTO updatePassengerDto)
        {
            var passenger = await _context.Passengers.FindAsync(id);
            if (passenger == null)
            {
                return NotFound();
            }

            passenger.FirstName = updatePassengerDto.FirstName;
            passenger.LastName = updatePassengerDto.LastName;
            passenger.Age = updatePassengerDto.Age;
            passenger.Gender = updatePassengerDto.Gender;
            passenger.Email = updatePassengerDto.Email; // New field
            passenger.PhoneNumber = updatePassengerDto.PhoneNumber; // New field

            _context.Entry(passenger).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PassengerExists(id))
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


        // DELETE: api/Passenger/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePassenger(Guid id)
        {
            var passenger = await _context.Passengers.FindAsync(id);
            if (passenger == null)
            {
                return NotFound();
            }

            _context.Passengers.Remove(passenger);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PassengerExists(Guid id)
        {
            return _context.Passengers.Any(p => p.PassengerId == id);
        }

        private string GenerateTicketCode()
        {
            string code;
            var random = new Random();

            do
            {
                code = random.Next(1000000, 9999999).ToString() +
                       random.Next(100000, 999999).ToString();
            }
            while (_context.Passengers.Any(p => p.TicketCode == code));

            return code;
        }
    }

}