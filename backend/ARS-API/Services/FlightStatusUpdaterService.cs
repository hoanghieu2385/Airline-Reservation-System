using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ARS_API.Services
{
    public class FlightStatusUpdaterService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<FlightStatusUpdaterService> _logger;

        public FlightStatusUpdaterService(IServiceScopeFactory scopeFactory, ILogger<FlightStatusUpdaterService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("FlightStatusUpdaterService started.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDBContext>();

                    var now = DateTime.UtcNow;

                    var flightsToUpdate = await dbContext.Flights
                        .Where(f => f.Status != "COMPLETED" && f.DepartureTime <= now)
                        .ToListAsync(stoppingToken);

                    if (flightsToUpdate.Any())
                    {
                        foreach (var flight in flightsToUpdate)
                        {
                            flight.Status = "COMPLETED";
                        }

                        await dbContext.SaveChangesAsync(stoppingToken);
                        _logger.LogInformation($"{flightsToUpdate.Count} flights updated to COMPLETED.");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred while updating flight statuses.");
                }

                // Wait for 1 minute before checking again
                await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken);
            }
        }

        public override Task StopAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("FlightStatusUpdaterService is stopping.");
            return base.StopAsync(stoppingToken);
        }
    }
}
