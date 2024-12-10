using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ARS_API.Models
{
    public class UserModel
    {
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; }

        [MaxLength(255)]
        public string Address { get; set; }

        [Range(0, int.MaxValue)]
        public int SkyMiles { get; set; } = 0;

        [Column(TypeName = "date")]
        public DateTime? DateOfBirth { get; set; }
    }
}
