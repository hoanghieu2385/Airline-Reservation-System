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

        // Get PriceMultiplier based on DaysBeforeDeparture
        public async Task<decimal> GetPriceMultiplierAsync(int daysBeforeDeparture)
        {
            var pricingRule = await _context.PricingRules
                .Where(rule => rule.DaysBeforeDeparture >= daysBeforeDeparture)
                .OrderBy(rule => rule.DaysBeforeDeparture)
                .FirstOrDefaultAsync();

            return pricingRule?.PriceMultiplier ?? 1.0m; // Default multiplier is 1 if no rule matches
        }

        // Calculate DynamicPrice
        public decimal CalculateDynamicPrice(decimal basePrice, decimal basePriceMultiplier, decimal priceMultiplier)
        {
            return basePrice * basePriceMultiplier * priceMultiplier;
        }
    }

}