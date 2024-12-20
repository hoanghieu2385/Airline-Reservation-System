using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARS_API.Models
{
    public class PricingRule
    {
        public Guid RuleId { get; set; }
        public int DaysBeforeDeparture { get; set; }
        public decimal PriceMultiplier { get; set; }
        
    }
}