using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TheWall.Models
{
    public class Review
    {
        [Key]
        public int ReviewId { get; set; }

        [Required]
        [MinLength(2, ErrorMessage = "Review must have content")]
        public string Content { get; set; }

        [Required]
        public int Rating { get; set; }

        [Required]
        public int ReviewerId { get; set; }

        [Required]
        public int ProductId { get; set; }

        [ForeignKey("ReviewerId")]
        public User Reviewer { get; set; }

        [ForeignKey("ProductId")]
        public Product ReviewedProduct { get; set; }

    }
}
