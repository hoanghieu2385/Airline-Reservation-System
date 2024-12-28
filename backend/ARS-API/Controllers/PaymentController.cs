using ARS_API.Models;
using ARS_API.Services;
using Microsoft.AspNetCore.Mvc;

namespace ARS_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;

        public PaymentController(IVnPayService vnPayService)
        {
            _vnPayService = vnPayService;
        }

        [HttpPost("CreatePaymentUrlVnpay")]
        public IActionResult CreatePaymentUrlVnpay([FromBody] PaymentInformationModel model)
        {
            if (model == null)
            {
                return BadRequest("Invalid payment information model.");
            }

            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);
            return Ok(new { PaymentUrl = url });
        }

        // thêm vào trang checkout
        [HttpGet("PaymentCallbackVnpay")]
        public IActionResult PaymentCallbackVnpay()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);
            return Ok(response);
        }
    }
}
