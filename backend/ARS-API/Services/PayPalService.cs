using ARS_API.Models;
using Microsoft.Extensions.Options;
using PayPalCheckoutSdk.Core;
using PayPalCheckoutSdk.Orders;
using System.Threading.Tasks;

namespace ARS_API.Services
{
    public class PayPalService
    {
        private readonly PayPalEnvironment _environment;
        private readonly PayPalHttpClient _client;

        public PayPalService(IOptions<PayPalSettings> options)
        {
            var settings = options.Value;
            _environment = settings.IsSandbox
                ? new SandboxEnvironment(settings.ClientId, settings.ClientSecret)
                : new LiveEnvironment(settings.ClientId, settings.ClientSecret);

            _client = new PayPalHttpClient(_environment);
        }

        public async Task<Order> CreateOrderAsync(string amount, string currency, string description, string returnUrl, string cancelUrl)
        {
            var request = new OrdersCreateRequest();
            request.Prefer("return=representation");
            request.RequestBody(new OrderRequest
            {
                CheckoutPaymentIntent = "CAPTURE",
                PurchaseUnits = new System.Collections.Generic.List<PurchaseUnitRequest>
                {
                    new PurchaseUnitRequest
                    {
                        AmountWithBreakdown = new AmountWithBreakdown
                        {
                            CurrencyCode = currency,
                            Value = amount
                        },
                        Description = description
                    }
                },
                ApplicationContext = new ApplicationContext
                {
                    BrandName = "ARS",
                    ReturnUrl = returnUrl,
                    CancelUrl = cancelUrl
                }
            });

            var response = await _client.Execute(request);
            return response.Result<Order>();
        }

        public async Task<Order> CaptureOrderAsync(string orderId)
        {
            var request = new OrdersCaptureRequest(orderId);
            request.RequestBody(new OrderActionRequest());

            var response = await _client.Execute(request);
            return response.Result<Order>();
        }

        public async Task<Order> GetOrderDetailsAsync(string orderId)
        {
            var request = new OrdersGetRequest(orderId);

            var response = await _client.Execute(request);
            return response.Result<Order>();
        }
    }
}
