using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ARS_API.Models;
using System.Reflection.Emit;

public class ApplicationDBContext : IdentityDbContext<IdentityUser, IdentityRole, string>
{
    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
    {
    }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Tạo sẵn các role
        builder.Entity<IdentityRole>().HasData(
            new IdentityRole { Id = Guid.NewGuid().ToString(), Name = "User", NormalizedName = "USER" },
            new IdentityRole { Id = Guid.NewGuid().ToString(), Name = "Manager", NormalizedName = "MANAGER" },
            new IdentityRole { Id = Guid.NewGuid().ToString(), Name = "Admin", NormalizedName = "ADMIN" }
        );
    }
    public DbSet<UserModel> Users { get; set; }
}