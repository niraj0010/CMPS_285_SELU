using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;

namespace LearningStarter.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
        public String ProductCategories { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }

        public string Status { get; set; }
        public string UserName {  get; set; }

        public DateTimeOffset DateAdded { get; set; }
        public virtual ICollection<Images> Images { get; set; } = new List<Images>();
        public virtual ICollection<Reviews> Reviews { get; set; } = new List<Reviews>();
    }

    public class ProductGetDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string ProductCategories { get; set; }
        public string Name { get; set; }

        public string Description { get; set; }
        public decimal Price { get; set; }

        public string Status { get; set; }
        public DateTimeOffset DateAdded { get; set; }
        public string UserName {  get; set; }
        public List<ImageGetDto> Images { get; set; } = new List<ImageGetDto>();
    }
    public class ProductCreateDto
    {

        public string Name { get; set; }
        public int UserId { get; set; }
        public string ProductCategories { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string Status { get; set; }
        public DateTimeOffset DateAdded { get; set; }
        public string UserName { get; set; }
        public List<ImageCreateDto> Images { get; set; }
    }
    public class ProductUpdateDto
    {

        public string Name { get; set; }
        public string ProductCategories { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public string Status { get; set; }
        public DateTimeOffset DateAdded { get; set; }
        public string UserName { get; set; }
        public List<int> ImageIds { get; set; } = new List<int>();

        public List<ImageCreateDto> Images { get; set; } = new List<ImageCreateDto>();

    }
    public class ProductEntityTypeConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.ToTable("Products");
            builder.HasMany(p => p.Reviews)
            .WithOne(r => r.Product)
            .HasForeignKey(r => r.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        }


    }
}