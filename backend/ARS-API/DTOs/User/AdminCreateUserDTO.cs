namespace ARS_API.DTOs.User
{
    public class AdminCreateUserDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Role { get; set; } // USER, CLERK, ADMIN
        public int SkyMiles { get; set; } = 0; // Default 0
        public string Password { get; set; }
        public bool PhoneNumberConfirmed { get; set; } = false; // Default to false
    }
}
