using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using PayPal.Api;

namespace ARS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PayPalController : ControllerBase
    {
        private readonly IConfiguration _config;

        public PayPalController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("create-payment")]
        public IActionResult CreatePayment()
        {
            // Lấy thông tin cấu hình PayPal từ appsettings.json
            var clientId = _config["PayPal:ClientId"];
            var secret = _config["PayPal:Secret"];
            var mode = _config["PayPal:Mode"];

            // Tạo context PayPal
            var apiContext = new APIContext(new OAuthTokenCredential(clientId, secret).GetAccessToken())
            {
                Config = new Dictionary<string, string>
            {
                { "mode", mode } // "sandbox" hoặc "live"
            }
            };

            // Tạo payment object
            var payment = new Payment
            {
                intent = "sale",
                payer = new Payer { payment_method = "paypal" },
                transactions = new List<Transaction>
            {
                new Transaction
                {
                    description = "Thanh toán sản phẩm",
                    invoice_number = Guid.NewGuid().ToString(),
                    amount = new Amount
                    {
                        currency = "USD",
                        total = "20.00" // Giá tiền
                    }
                }
            },
                redirect_urls = new RedirectUrls
                {
                    cancel_url = "http://localhost:3000/cancel", // URL khi người dùng hủy
                    return_url = "http://localhost:3000/success" // URL khi thanh toán thành công
                }
            };

            // Tạo Payment trên PayPal
            var createdPayment = payment.Create(apiContext);

            // Lấy link redirect người dùng tới PayPal
            var redirectUrl = createdPayment.links.FirstOrDefault(link => link.rel == "approval_url")?.href;

            return Ok(new { redirectUrl });
        }
    }
}