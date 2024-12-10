using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

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
            new IdentityRole { Id = Guid.NewGuid().ToString(), Name = "Admin", NormalizedName = "ADMIN" },
            new IdentityRole { Id = Guid.NewGuid().ToString(), Name = "Clerk", NormalizedName = "CLERK" },
            new IdentityRole { Id = Guid.NewGuid().ToString(), Name = "Guest", NormalizedName = "GUEST" }
        );
    }
}