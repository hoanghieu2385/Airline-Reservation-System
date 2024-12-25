namespace ARS_API.DTOs.User
{
    public class AdminUpdateUserDTO
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Role { get; set; }
        public bool? EmailConfirmed { get; set; }
        public bool? PhoneNumberConfirmed { get; set; } 
    }
}
