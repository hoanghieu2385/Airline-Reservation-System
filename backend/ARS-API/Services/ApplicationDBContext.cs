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

        // FlightSeatAllocation -> SeatClass (many-to-one)
        builder.Entity<FlightSeatAllocation>()
            .HasOne(fsa => fsa.SeatClass)                   // previously fsa.Class, changed to fsa.SeatClass
            .WithMany()
            .HasForeignKey(fsa => fsa.ClassId)
            .OnDelete(DeleteBehavior.Restrict);

        // FlightSeatAllocation -> Flight
        builder.Entity<FlightSeatAllocation>()
            .HasOne(fsa => fsa.Flight)
            .WithMany(f => f.FlightSeatAllocations)
            .HasForeignKey(fsa => fsa.FlightId)
            .OnDelete(DeleteBehavior.Restrict);

        // Passenger ticket price configuration
        builder.Entity<Passenger>()
            .Property(p => p.TicketPrice)
            .HasColumnType("decimal(18,2)");

        // FlightRoute -> Origin Airport (many-to-one)
        builder.Entity<FlightRoute>()
            .HasOne(r => r.OriginAirport)
            .WithMany()
            .HasForeignKey(r => r.OriginAirportId)
            .OnDelete(DeleteBehavior.Restrict);

        // FlightRoute -> Destination Airport (many-to-one)
        builder.Entity<FlightRoute>()
            .HasOne(r => r.DestinationAirport)
            .WithMany()
            .HasForeignKey(r => r.DestinationAirportId)
            .OnDelete(DeleteBehavior.Restrict);

        // Flight -> FlightSeatAllocations (one-to-many)
        builder.Entity<Flight>()
            .HasMany(f => f.FlightSeatAllocations)
            .WithOne(fa => fa.Flight)
            .HasForeignKey(fa => fa.FlightId);
    }

    public DbSet<City> Cities { get; set; }
    public DbSet<Airport> Airports { get; set; }
    public DbSet<Airline> Airlines { get; set; }
    public DbSet<PricingRule> PricingRules { get; set; }
    public DbSet<Flight> Flights { get; set; }
    public DbSet<SeatClass> SeatClasses { get; set; }
    public DbSet<FlightSeatAllocation> FlightSeatAllocation { get; set; }
    public DbSet<Reservation> Reservations { get; set; }
    public DbSet<Passenger> Passengers { get; set; }
    public DbSet<FlightRoute> Routes { get; set; }
}