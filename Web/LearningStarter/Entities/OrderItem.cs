using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
namespace LearningStarter
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public string Image { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }

    }
    public class OrderItemGetDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public string Image { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
    public class OrderItemCreateDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public string Image { get; set; }
        public decimal Price { get; set; }
    }
    public class OrderItemUpdateDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
    public class OrderItemEntityTypeConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            builder.ToTable("OrderItem");
        }
    }

}