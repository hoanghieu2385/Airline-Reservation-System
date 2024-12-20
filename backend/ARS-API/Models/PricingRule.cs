using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ARS_API.Models
{
    public class PricingRule
    {
        [Key]
        public Guid RuleId { get; set; }
        public int DaysBeforeDeparture { get; set; }
        public decimal PriceMultiplier { get; set; }

    }
}