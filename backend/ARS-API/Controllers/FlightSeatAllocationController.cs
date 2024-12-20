using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ARS_API.Models;
using ARS_API.DTOs;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class FlightSeatAllocationController : ControllerBase
{
    private readonly ApplicationDBContext _context;

    public FlightSeatAllocationController(ApplicationDBContext context)
    {
        _context = context;
    }

    // GET: api/FlightSeatAllocation
    [HttpGet]
    public async Task<ActionResult<IEnumerable<FlightSeatAllocation>>> GetFlightSeatAllocations()
    {
        return await _context.FlightSeatAllocation.ToListAsync();
    }

    // GET: api/FlightSeatAllocation/{flightId}
    [HttpGet("{flightId}")]
    public async Task<ActionResult<IEnumerable<FlightSeatAllocation>>> GetFlightSeatAllocationsByFlightId(Guid flightId)
    {
        var allocations = await _context.FlightSeatAllocation
                                         .Where(a => a.FlightId == flightId)
                                         .ToListAsync();

        if (allocations == null || allocations.Count == 0)
        {
            return NotFound();
        }

        return allocations;
    }

    // POST: api/FlightSeatAllocation
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<FlightSeatAllocation>> PostFlightSeatAllocation(FlightSeatAllocation allocation)
    {
        allocation.AllocationId = Guid.NewGuid();
        _context.FlightSeatAllocation.Add(allocation);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetFlightSeatAllocationsByFlightId), new { flightId = allocation.FlightId }, allocation);
    }

    // PUT: api/FlightSeatAllocation/{id}
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> PutFlightSeatAllocation(Guid id, UpdateFlightSeatAllocationDTO updateDto)
    {
        // Retrieve the existing FlightSeatAllocation from the database
        var allocation = await _context.FlightSeatAllocation.FindAsync(id);
        if (allocation == null)
        {
            return NotFound();
        }

        // Update only the AvailableSeats field
        allocation.AvailableSeats = updateDto.AvailableSeats;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!FlightSeatAllocationExists(id))
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


    // DELETE: api/FlightSeatAllocation/{id}
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteFlightSeatAllocation(Guid id)
    {
        var allocation = await _context.FlightSeatAllocation.FindAsync(id);
        if (allocation == null)
        {
            return NotFound();
        }

        _context.FlightSeatAllocation.Remove(allocation);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool FlightSeatAllocationExists(Guid id)
    {
        return _context.FlightSeatAllocation.Any(e => e.AllocationId == id);
    }
}

