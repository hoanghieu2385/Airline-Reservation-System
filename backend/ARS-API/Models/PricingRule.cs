using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ARS_API.Models
{
    public class PricingRule
    {
        [Key]
        public Guid RuleId { get; set; }
        public int DaysBeforeDeparture { get; set; }
        [Column(TypeName = "decimal(10, 2)")]
        public decimal PriceMultiplier { get; set; }
    }
}