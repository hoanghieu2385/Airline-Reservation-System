using ARS_API.Dtos;
using ARS_API.Models;
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

        public UserController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return Unauthorized("Email hoặc mật khẩu không hợp lệ.");
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
                roles = userRoles
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            // Kiểm tra vai trò hợp lệ
            string[] validRoles = { "USER", "CLERK", "ADMIN", "GUEST" };
            if (!string.IsNullOrEmpty(model.Role) && !validRoles.Contains(model.Role))
            {
                return BadRequest("Vai trò không hợp lệ.");
            }

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // Thêm vai trò nếu được chỉ định
            if (!string.IsNullOrEmpty(model.Role))
            {
                await _userManager.AddToRoleAsync(user, model.Role);
            }
            else
            {
                // Mặc định là User nếu không chỉ định vai trò
                await _userManager.AddToRoleAsync(user, "USER");
            }

            return Ok(new { Message = "Người dùng đăng ký thành công.", UserId = user.Id });
        }

        [HttpGet("read")]
        [Authorize]
        public async Task<IActionResult> GetUsers()
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
                    Roles = roles
                });
            }

            return Ok(userList);
        }

        [HttpPut("update/{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto model)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("Không tìm thấy người dùng.");
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
                return BadRequest("Email không hợp lệ.");
            }

            return Ok("Cập nhật người dùng thành công.");
        }

        [HttpDelete("delete/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("Không tìm thấy người dùng.");
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok("Xóa người dùng thành công.");
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