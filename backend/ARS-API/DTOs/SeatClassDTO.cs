using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARS_API.DTOs
{
    public class SeatClassDTO
    {

    }

    public class UpdateSeatClassDto
    {
        public string? ClassName { get; set; }
        public int? LuggageAllowance { get; set; }
        public decimal? BasePriceMultiplier { get; set; }
    }

}