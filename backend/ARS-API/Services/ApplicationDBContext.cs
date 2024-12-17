using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ARS_API.Models;
using System.Reflection.Emit;

public class ApplicationDBContext : IdentityDbContext<ApplicationUser, IdentityRole, string>
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
            new IdentityRole { Id = Guid.NewGuid().ToString(), Name = "Admin", NormalizedName = "ADMIN" },
            new IdentityRole { Id = Guid.NewGuid().ToString(), Name = "Clerk", NormalizedName = "CLERK" },
            new IdentityRole { Id = Guid.NewGuid().ToString(), Name = "Guest", NormalizedName = "GUEST" }
        );


        // Flight -> Airline (many-to-one)
        builder.Entity<Flight>()
            .HasOne(f => f.Airline)
            .WithMany(a => a.Flights)
            .HasForeignKey(f => f.AirlineId)
            .OnDelete(DeleteBehavior.Restrict);

        // Flight -> Origin Airport (many-to-one)
        builder.Entity<Flight>()
            .HasOne(f => f.OriginAirport)
            .WithMany()
            .HasForeignKey(f => f.OriginAirportId)
            .OnDelete(DeleteBehavior.Restrict);

        // Flight -> Destination Airport (many-to-one)
        builder.Entity<Flight>()
            .HasOne(f => f.DestinationAirport)
            .WithMany()
            .HasForeignKey(f => f.DestinationAirportId)
            .OnDelete(DeleteBehavior.Restrict);

    }

    public DbSet<City> Cities { get; set; }
    public DbSet<Airport> Airports { get; set; }
    public DbSet<Airline> Airlines { get; set; }
    public DbSet<Flight> Flights { get; set; }
    public DbSet<SeatClass> SeatClasses { get; set; }
    public DbSet<FlightSeatAllocation> FlightSeatAllocation { get; set; }
    public DbSet<Reservation> Reservations { get; set; }



}