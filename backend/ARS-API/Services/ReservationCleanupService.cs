using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ARS_API.Models;

namespace ARS_API.Services
{
    public class ReservationCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;

        public ReservationCleanupService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var context = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();

                    // Fetch expired reservations
                    var expiredReservations = context.Reservations
                        .Where(r => r.ReservationStatus == "Blocked" &&
                                    r.BlockExpirationTime.HasValue &&
                                    r.BlockExpirationTime <= DateTime.UtcNow)
                        .ToList();

                    foreach (var reservation in expiredReservations)
                    {
                        // Update status to "Cancelled"
                        reservation.ReservationStatus = "Cancelled";

                        // Restore seats
                        var allocation = await context.FlightSeatAllocation.FindAsync(reservation.AllocationId);
                        if (allocation != null && reservation.NumberOfBlockedSeats.HasValue)
                        {
                            allocation.AvailableSeats += reservation.NumberOfBlockedSeats.Value;
                        }
                    }

                    // Save changes
                    await context.SaveChangesAsync();
                }

                // Run every 5 minutes
                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }
    }
}
