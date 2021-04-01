using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;
using TheWall.Models;
using Microsoft.AspNetCore.Authorization;


// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TheWall.Controllers
{

    [ApiController]
    [Route("[controller]")]

    public class ReviewController : Controller
    {
        private MyContext dbContext;
        private IConfiguration _config;

        public ReviewController(MyContext context, IConfiguration config)
        {
            dbContext = context;
            _config = config;
        }

        [Authorize]
        [HttpPost]
        [Route("create")]
        public string Create(Review review)
        {
            User user = dbContext.Users.FirstOrDefault(j => j.UserId == review.ReviewerId);



            if (ModelState.IsValid)
            {
                Review newReview = new Review()
                {
                    Content = review.Content,
                    Rating = review.Rating,
                    ReviewerId = review.ReviewerId,
                    ProductId = review.ProductId,

                   


                };
                dbContext.Reviews.Add(newReview);
                dbContext.SaveChanges();
                var message = new { message = "Review successfully submitted!", review = newReview };
                return JsonConvert.SerializeObject(message);
            }
            else
            {
                Console.WriteLine("MODELSTATE is not valid!");
                var error = new { message = "Error", Error = "MODELSTATE IS NOT VALID" };
                return JsonConvert.SerializeObject(error);
            }
        }

        [Authorize]
        [HttpGet]
        [Route("index")]

        public string Index()
        {
            List<Review> reviews = dbContext.Reviews.Include(u => u.Reviewer).ToList();
            var message = new { message = "Got all reviews!", Reviews = reviews };
            return JsonConvert.SerializeObject(message);
        }
    }
}
