﻿using ARS_API.DTOs;
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

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(token))
                return BadRequest("Invalid email confirmation token");

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound("User not found");

            // Xác nhận email
            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (!result.Succeeded)
                return BadRequest("Email confirmation failed");

            return Ok("Email confirmed successfully. You can now login to your account.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return Unauthorized("Email or password is incorrect.");
            }

            // Kiểm tra xem email đã được xác nhận chưa
            if (!user.EmailConfirmed)
            {
                return BadRequest("Please confirm your email before logging in.");
            }

            var userRoles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
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
            // List of valid roles
            string[] validRoles = { "USER", "CLERK", "ADMIN" };

            // Check if the provided role is valid
            if (!string.IsNullOrEmpty(model.Role) && !validRoles.Contains(model.Role.ToUpper()))
            {
                return BadRequest("Role does not exist or input is incorrect.");
            }

            // Default role is "USER" if no role is provided
            var role = string.IsNullOrEmpty(model.Role) ? "USER" : model.Role.ToUpper();

            // Create a new user instance
            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                EmailConfirmed = false // Đảm bảo email chưa được xác nhận
            };

            // Create the user with the provided password
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return BadRequest(new { Message = "Registration failed.", Errors = errors });
            }

            // Assign the role to the user
            var roleResult = await _userManager.AddToRoleAsync(user, role);
            if (!roleResult.Succeeded)
            {
                await _userManager.DeleteAsync(user);
                var errors = roleResult.Errors.Select(e => e.Description).ToList();
                return BadRequest(new { Message = "Failed to assign role.", Errors = errors });
            }

            // Tạo token xác nhận email
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

            // Tạo link xác nhận
            var confirmationLink = Url.Action("ConfirmEmail", "User",
                new { userId = user.Id, token = token },
                protocol: HttpContext.Request.Scheme);

            // Gửi email xác nhận
            var emailContent = $@"
                <h2>Xác nhận đăng ký tài khoản</h2>
                <p>Vui lòng click vào link bên dưới để xác nhận email của bạn:</p>
                <a href='{confirmationLink}'>Xác nhận email</a>
            ";

            await _emailService.SendEmailAsync(
                user.Email,
                "Xác nhận đăng ký tài khoản",
                emailContent
            );

            return Ok(new
            {
                Message = "Đăng ký thành công. Vui lòng kiểm tra email để xác nhận tài khoản.",
                UserId = user.Id
            });
        }

        [HttpGet("read")]
        [Authorize(Roles = "Admin,Clerk")] // allow for admin, clerk
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
            var roles = User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

            // if not admin, clerk, user dont see another profile   
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

        // Users get personal information through session
        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            return await GetProfileById(userId); // reuse logic from GetProfileById
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

            // Cập nhật email nếu được cung cấp
            if (!string.IsNullOrEmpty(model.NewEmail))
            {
                user.Email = model.NewEmail;
                user.UserName = model.NewEmail;
            }

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return BadRequest(updateResult.Errors);
            }

            // Đặt lại mật khẩu nếu được cung cấp
            if (!string.IsNullOrEmpty(model.NewPassword))
            {
                var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
                var passwordResult = await _userManager.ResetPasswordAsync(user, resetToken, model.NewPassword);
                if (!passwordResult.Succeeded)
                {
                    return BadRequest(passwordResult.Errors);
                }
            }

            if (!string.IsNullOrEmpty(model.NewEmail) && !model.NewEmail.Contains("@"))
            {
                return BadRequest("Email is incorrect.");
            }

            return Ok("User updated successfully.");
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