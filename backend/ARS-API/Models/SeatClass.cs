using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ARS_API.Models
{
    public class SeatClass
    {
        [Key]
        public Guid ClassId { get; set; }
        public Guid AirlineId { get; set; }
        public string ClassName { get; set; }
        public int LuggageAllowance { get; set; }
        
        [Column(TypeName = "decimal(10, 2)")]
        public decimal BasePriceMultiplier { get; set; }
    }
}