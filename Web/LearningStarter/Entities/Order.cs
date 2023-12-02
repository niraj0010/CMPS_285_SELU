using System;
using LearningStarter.Entities;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace LearningStarter.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public DateTimeOffset Date { get; set; }
        public string Status { get; set; }
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }

    public class OrderGetDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public DateTimeOffset Date { get; set; }
        public string Status { get; set; }
        public List<OrderItemGetDto> OrderItems { get; set; } = new List<OrderItemGetDto>();

    }

    public class OrderCreateDto
    {
        public int UserId { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public DateTimeOffset Date { get; set; }
        public string Status { get; set; }
        public List<OrderItemCreateDto> OrderItems { get; set; } = new List<OrderItemCreateDto>();
    }

    public class OrderUpdateDto
    {
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string Status { get; set; }
    }

    public class OrdersEntityTypeConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.ToTable("Orders");
        }


    }
}