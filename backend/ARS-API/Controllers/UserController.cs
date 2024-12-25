using ARS_API.DTOs;
using ARS_API.Models;
using ARS_API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ARS_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public UserController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            IEmailService emailService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            // Generate reset token
            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

            // Create reset link
            var resetLink = Url.Action("ResetPassword", "User",
                new { token = resetToken, email = user.Email },
                protocol: HttpContext.Request.Scheme);

            // Send reset email
            var emailContent = $@"
                <h2>Reset Your Password</h2>
                <p>Click the link below to reset your password:</p>
                <a href='{resetLink}'>Reset Password</a>";

            try
            {
                await _emailService.SendEmailAsync(
                    user.Email,
                    "Reset Password",
                    emailContent
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
                return StatusCode(500, "Failed to send reset password email. Please try again.");
            }

            return Ok("Password reset email sent.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            if (model.NewPassword != model.ConfirmPassword)
            {
                return BadRequest("Passwords do not match.");
            }

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest("Invalid email.");
            }

            var resetResult = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
            if (!resetResult.Succeeded)
            {
                return BadRequest(new
                {
                    Message = "Failed to reset password.",
                    Errors = resetResult.Errors.Select(e => e.Description)
                });
            }

            return Ok("Password has been reset successfully.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return Unauthorized("Email or password is incorrect.");
            }

            // Check if email is confirmed
            if (!user.EmailConfirmed)
            {
                return BadRequest("Please confirm your email before logging in.");
            }

            var userRoles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            authClaims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

            var token = CreateJwtToken(authClaims);

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo,
                roles = userRoles,
                user = new
                {
                    user.Id,
                    user.UserName,
                    user.Email,
                    user.FirstName,
                    user.LastName
                }
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            string[] validRoles = { "USER", "CLERK", "ADMIN" };

            if (!string.IsNullOrEmpty(model.Role) && !validRoles.Contains(model.Role.ToUpper()))
            {
                return BadRequest("Role does not exist or input is incorrect.");
            }

            var role = string.IsNullOrEmpty(model.Role) ? "USER" : model.Role.ToUpper();

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                EmailConfirmed = false
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return BadRequest(new { Message = "Registration failed.", Errors = errors });
            }

            var roleResult = await _userManager.AddToRoleAsync(user, role);
            if (!roleResult.Succeeded)
            {
                await _userManager.DeleteAsync(user);
                var errors = roleResult.Errors.Select(e => e.Description).ToList();
                return BadRequest(new { Message = "Failed to assign role.", Errors = errors });
            }

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            var confirmationLink = Url.Action("ConfirmEmail", "User",
                new { userId = user.Id, token = token },
                protocol: HttpContext.Request.Scheme);

            var emailContent = $@"
                <h2>Confirm Your Registration</h2>
                <p>Click the link below to confirm your email:</p>
                <a href='{confirmationLink}'>Confirm Email</a>";

            try
            {
                await _emailService.SendEmailAsync(
                    user.Email,
                    "Confirm Your Account",
                    emailContent
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
                return StatusCode(500, "Failed to send confirmation email. Please try again.");
            }

            return Ok(new
            {
                Message = "Registration successful. Please check your email to confirm your account.",
                UserId = user.Id
            });
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(token))
                return BadRequest("Invalid email confirmation token");

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound("User not found");

            try
            {
                var result = await _userManager.ConfirmEmailAsync(user, token);
                if (!result.Succeeded)
                {
                    return BadRequest(new { Message = "Invalid or expired email confirmation token." });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error confirming email: {ex.Message}");
                return StatusCode(500, "An error occurred while confirming email.");
            }

            return Redirect("http://localhost:3000/login");
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return await GetProfileById(userId);
        }

        [HttpGet("read")]
        [Authorize(Roles = "Admin,Clerk")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = _userManager.Users.ToList();
            var userList = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userList.Add(new
                {
                    user.Id,
                    user.UserName,
                    user.Email,
                    user.FirstName,
                    user.LastName,
                    Roles = roles
                });
            }

            return Ok(userList);
        }

        [HttpGet("read/{id}")]
        [Authorize]
        public async Task<IActionResult> GetProfileById(string id)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (currentUserId == null)
            {
                return Unauthorized("Invalid token: Missing user identifier.");
            }

            var roles = User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

            if (!roles.Contains("ADMIN") && !roles.Contains("CLERK") && currentUserId != id)
            {
                return Forbid("You are not authorized to view this profile.");
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var userRoles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                user.Id,
                user.UserName,
                user.Email,
                user.FirstName,
                user.LastName,
                Roles = userRoles
            });
        }


        [HttpPut("update/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto model)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var roles = User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();
            if (!roles.Contains("ADMIN") && !roles.Contains("CLERK") && currentUserId != id)
            {
                return Forbid("You are not authorized to update this profile.");
            }

            if (!string.IsNullOrEmpty(model.FirstName))
                user.FirstName = model.FirstName;

            if (!string.IsNullOrEmpty(model.LastName))
                user.LastName = model.LastName;

            if (!string.IsNullOrEmpty(model.Address))
                user.Address = model.Address;

            if (!string.IsNullOrEmpty(model.PhoneNumber))
                user.PhoneNumber = model.PhoneNumber;

            if (model.DateOfBirth.HasValue)
                user.DateOfBirth = model.DateOfBirth;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return BadRequest(new
                {
                    Message = "Failed to update user profile.",
                    Errors = updateResult.Errors.Select(e => e.Description)
                });
            }

            if (!string.IsNullOrEmpty(model.NewPassword))
            {
                if (model.NewPassword != model.ConfirmPassword)
                {
                    return BadRequest("Passwords do not match.");
                }

                if (!await _userManager.CheckPasswordAsync(user, model.CurrentPassword))
                {
                    return BadRequest("Current password is incorrect.");
                }

                var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
                var passwordResult = await _userManager.ResetPasswordAsync(user, resetToken, model.NewPassword);
                if (!passwordResult.Succeeded)
                {
                    return BadRequest(new
                    {
                        Message = "Failed to update password.",
                        Errors = passwordResult.Errors.Select(e => e.Description)
                    });
                }
            }

            return Ok(new
            {
                Message = "User updated successfully.",
                UpdatedFields = new
                {
                    user.FirstName,
                    user.LastName,
                    user.Address,
                    user.PhoneNumber,
                    user.DateOfBirth
                }
            });
        }

        [HttpDelete("delete/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok("User deleted successfully.");
        }

        private JwtSecurityToken CreateJwtToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

            return new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );
        }
    }
}
