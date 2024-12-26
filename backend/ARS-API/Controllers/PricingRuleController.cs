using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ARS_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ARS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PricingRuleController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public PricingRuleController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET: api/PricingRule
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PricingRule>>> GetPricingRules()
        {
            return await _context.PricingRules.ToListAsync();
        }

        // GET: api/PricingRule/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<PricingRule>> GetPricingRuleById(Guid id)
        {
            var pricingRule = await _context.PricingRules.FindAsync(id);

            if (pricingRule == null)
            {
                return NotFound();
            }

            return pricingRule;
        }

        // GET: api/PricingRule/multiplier/{daysBeforeDeparture}
        [HttpGet("multiplier/{daysBeforeDeparture}")]
        public async Task<ActionResult<decimal>> GetPriceMultiplier(int daysBeforeDeparture)
        {
            Console.WriteLine($"Received daysBeforeDeparture: {daysBeforeDeparture}");
            var pricingRule = await _context.PricingRules
                .Where(rule => rule.DaysBeforeDeparture >= daysBeforeDeparture)
                .OrderBy(rule => rule.DaysBeforeDeparture)
                .FirstOrDefaultAsync();

            if (pricingRule == null)
            {
                return Ok(1.0m); // Default multiplier
            }

            return Ok(pricingRule.PriceMultiplier);
        }

        // POST: api/PricingRule
        [HttpPost]
        public async Task<ActionResult<PricingRule>> CreatePricingRule(PricingRule pricingRule)
        {
            pricingRule.RuleId = Guid.NewGuid(); // Ensure a new Guid is generated
            _context.PricingRules.Add(pricingRule);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPricingRuleById), new { id = pricingRule.RuleId }, pricingRule);
        }

        // PUT: api/PricingRule/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePricingRule(Guid id, PricingRule pricingRule)
        {
            if (id != pricingRule.RuleId)
            {
                return BadRequest("Mismatched Pricing Rule ID.");
            }

            _context.Entry(pricingRule).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PricingRuleExists(id))
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

        // DELETE: api/PricingRule/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePricingRule(Guid id)
        {
            var pricingRule = await _context.PricingRules.FindAsync(id);
            if (pricingRule == null)
            {
                return NotFound();
            }

            _context.PricingRules.Remove(pricingRule);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PricingRuleExists(Guid id)
        {
            return _context.PricingRules.Any(e => e.RuleId == id);
        }
    }
}
