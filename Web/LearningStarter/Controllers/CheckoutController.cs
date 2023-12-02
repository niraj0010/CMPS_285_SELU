using LearningStarter.Common;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Stripe;
using Stripe.Checkout;
using System;
using System.Collections.Generic;
using System.Web;

namespace LearningStarter.Controllers
{
    [ApiController]
    [Route("api/checkout")]
    public class CheckoutController : Controller
    {
        private readonly IConfiguration _configuration;

        public CheckoutController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost]
        public ActionResult CreateCheckoutSession([FromBody] List<CartItem> cartItems)
        {
            var response = new Response();
            var domain = _configuration["AppSettings:Domain"];
            var stripeSecretKey = _configuration["Stripe:SecretKey"];

            StripeConfiguration.ApiKey = stripeSecretKey;

            var options = new SessionCreateOptions
            {
                LineItems = new List<SessionLineItemOptions>(),
                Mode = "payment",
                CancelUrl = domain + "/cart",
                SuccessUrl = domain + "/cartConfirm"
            };

            foreach (var item in cartItems)
            {
                var sessionItem = new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = (long)((item.Price * 100) * (item.Quantity)),
                        Currency = "usd",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = item.Name,
                        }
                    },
                    Quantity = item.Quantity,
                };
                options.LineItems.Add(sessionItem);
            }

            try
            {
                var service = new SessionService();
                Session session = service.Create(options);

                var updatedOptions = new SessionCreateOptions
                {
                    PaymentMethodTypes = options.PaymentMethodTypes,
                    LineItems = options.LineItems,
                    Mode = options.Mode,
                    SuccessUrl = domain + "/cartConfirm?session_id=" + HttpUtility.UrlEncode(session.Id),
                    CancelUrl = options.CancelUrl,
                };

                session = service.Create(updatedOptions);

                response.Data = new { SessionId = session.Id, SessionUrl = session.Url };
                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error creating checkout session: {ex.Message}");
                return BadRequest();
            }
        }
    }
}
