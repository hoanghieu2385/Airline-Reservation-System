using ARS_API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ARS_API.Data
{
    public static class DataSeeder
    {
        public static async Task SeedRolesAndAdminAsync(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            // Seed Roles
            string[] roleNames = { "USER", "CLERK", "ADMIN" };
            foreach (var roleName in roleNames)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            // Seed Admin User
            string adminEmail = "admin@system.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(adminUser, "Admin@123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }
        }

        public static async Task SeedDatabaseAsync(ApplicationDBContext context)
        {
            // Ensure the database is created
            await context.Database.EnsureCreatedAsync();

            // Check if data already exists
            if (await context.Airlines.AnyAsync()) return;

            // Seed Airlines
            var airlines = new List<Airline>
            {
                new Airline { AirlineId = Guid.NewGuid(), AirlineName = "Sky Airways", AirlineCode = "SKY", Country = "USA" },
                new Airline { AirlineId = Guid.NewGuid(), AirlineName = "Oceanic Airlines", AirlineCode = "OCE", Country = "Canada" }
            };
            await context.Airlines.AddRangeAsync(airlines);

            // Seed Airports
            var airports = new List<Airport>
            {
                new Airport { AirportId = Guid.NewGuid(), CityId = Guid.NewGuid(), AirportCode = "JFK", AirportName = "John F. Kennedy International Airport" },
                new Airport { AirportId = Guid.NewGuid(), CityId = Guid.NewGuid(), AirportCode = "LAX", AirportName = "Los Angeles International Airport" }
            };
            await context.Airports.AddRangeAsync(airports);

            // Seed Flights
            var flights = new List<Flight>
            {
                new Flight
                {
                    FlightId = Guid.NewGuid(),
                    FlightNumber = "SKY123",
                    AirlineId = airlines[0].AirlineId,
                    OriginAirportId = airports[0].AirportId,
                    DestinationAirportId = airports[1].AirportId,
                    DepartureTime = DateTime.UtcNow.AddDays(1),
                    ArrivalTime = DateTime.UtcNow.AddDays(1).AddHours(6),
                    Duration = 360, // In minutes
                    TotalSeats = 200,
                    BasePrice = 150.00m,
                    Status = "Scheduled"
                }
            };
            await context.Flights.AddRangeAsync(flights);

            // Seed Seat Classes
            var seatClasses = new List<SeatClass>
            {
                new SeatClass { ClassId = Guid.NewGuid(), AirlineId = airlines[0].AirlineId, ClassName = "Economy", LuggageAllowance = 20, BasePriceMultiplier = 1.0m },
                new SeatClass { ClassId = Guid.NewGuid(), AirlineId = airlines[0].AirlineId, ClassName = "Business", LuggageAllowance = 30, BasePriceMultiplier = 1.5m }
            };
            await context.SeatClasses.AddRangeAsync(seatClasses);

            // Seed Flight Seat Allocations
            var flightSeatAllocations = new List<FlightSeatAllocation>
            {
                new FlightSeatAllocation { AllocationId = Guid.NewGuid(), FlightId = flights[0].FlightId, ClassId = seatClasses[0].ClassId, AvailableSeats = 150 },
                new FlightSeatAllocation { AllocationId = Guid.NewGuid(), FlightId = flights[0].FlightId, ClassId = seatClasses[1].ClassId, AvailableSeats = 50 }
            };
            await context.FlightSeatAllocation.AddRangeAsync(flightSeatAllocations);

            // Seed Reservations and Passengers
            var reservations = new List<Reservation>
            {
                new Reservation
                {
                    ReservationId = Guid.NewGuid(),
                    ReservationCode = "ABC123",
                    UserId = "user1",
                    FlightId = flights[0].FlightId,
                    AllocationId = flightSeatAllocations[0].AllocationId,
                    ReservationStatus = "Confirmed",
                    TotalPrice = 300.00m,
                    TravelDate = flights[0].DepartureTime,
                    CreatedAt = DateTime.UtcNow,
                    Passengers = new List<Passenger>
                    {
                        new Passenger { PassengerId = Guid.NewGuid(), FirstName = "John", LastName = "Doe", Age = 30, Gender = "Male", TicketCode = "TCKT12345678", TicketPrice = 150.00m },
                        new Passenger { PassengerId = Guid.NewGuid(), FirstName = "Jane", LastName = "Smith", Age = 28, Gender = "Female", TicketCode = "TCKT12345679", TicketPrice = 150.00m }
                    }
                },
                new Reservation
                {
                    ReservationId = Guid.NewGuid(),
                    ReservationCode = "DEF456",
                    UserId = "user2",
                    FlightId = flights[0].FlightId,
                    AllocationId = flightSeatAllocations[1].AllocationId,
                    ReservationStatus = "Confirmed",
                    TotalPrice = 450.00m,
                    TravelDate = flights[0].DepartureTime,
                    CreatedAt = DateTime.UtcNow,
                    Passengers = new List<Passenger>
                    {
                        new Passenger { PassengerId = Guid.NewGuid(), FirstName = "Alice", LastName = "Johnson", Age = 35, Gender = "Female", TicketCode = "TCKT12345680", TicketPrice = 200.00m },
                        new Passenger { PassengerId = Guid.NewGuid(), FirstName = "Bob", LastName = "Brown", Age = 40, Gender = "Male", TicketCode = "TCKT12345681", TicketPrice = 250.00m }
                    }
                }
            };
            await context.Reservations.AddRangeAsync(reservations);

            // Save all changes
            await context.SaveChangesAsync();
        }
    }
}