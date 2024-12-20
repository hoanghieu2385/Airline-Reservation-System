using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ARS_API.Services
{
public class PricingService
{
    private readonly ApplicationDBContext _context;

    public PricingService(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<decimal> GetPriceMultiplierAsync(int daysBeforeDeparture)
    {
        var pricingRule = await _context.PricingRules
            .Where(rule => rule.DaysBeforeDeparture <= daysBeforeDeparture)
            .OrderByDescending(rule => rule.DaysBeforeDeparture)
            .FirstOrDefaultAsync();

        return pricingRule?.PriceMultiplier ?? 1.0m; // Default multiplier if no rule matches
    }

    public decimal CalculateDynamicPrice(decimal basePrice, decimal priceMultiplier, decimal basePriceMultiplier)
    {
        return basePrice * priceMultiplier * basePriceMultiplier;
    }
}

}