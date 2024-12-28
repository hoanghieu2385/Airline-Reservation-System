using ARS_API.DTOs;
using ARS_API.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PayPalController : ControllerBase
    {
        private readonly PayPalService _payPalService;

        public PayPalController(PayPalService payPalService)
        {
            _payPalService = payPalService;
        }

        [HttpPost("create-paypal-order")]
        public async Task<IActionResult> CreatePayPalOrder([FromBody] CreatePaymentRequestDTO orderRequest)
        {
            if (orderRequest == null)
            {
                return BadRequest("Invalid request data: Body cannot be null.");
            }

            Console.WriteLine($"Received Order Request: {JsonConvert.SerializeObject(orderRequest)}");

            try
            {
                var order = await _payPalService.CreateOrderAsync(
                    orderRequest.Amount,
                    orderRequest.Currency,
                    orderRequest.Description,
                    orderRequest.ReturnUrl,
                    orderRequest.CancelUrl
                );

                var approveUrl = order.Links?.FirstOrDefault(link => link.Rel == "approve")?.Href;
                if (approveUrl == null)
                {
                    return BadRequest("Unable to create PayPal order.");
                }

                return Ok(new { approveUrl });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("create-order")]
        public async Task<IActionResult> CreateOrder([FromBody] CreatePaymentRequestDTO request)
        {
            try
            {
                var order = await _payPalService.CreateOrderAsync(
                    request.Amount, request.Currency, request.Description, request.ReturnUrl, request.CancelUrl);

                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("capture-order/{orderId}")]
        public async Task<IActionResult> CaptureOrder(string orderId)
        {
            try
            {
                var order = await _payPalService.CaptureOrderAsync(orderId);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("order-details/{orderId}")]
        public async Task<IActionResult> GetOrderDetails(string orderId)
        {
            try
            {
                var order = await _payPalService.GetOrderDetailsAsync(orderId);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
