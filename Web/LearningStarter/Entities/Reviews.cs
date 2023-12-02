using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Reviews
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ProductId { get; set; }
    public double Ratings { get; set; }
    public string Comments { get; set; }
    public User User { get; set; }
    public Product Product { get; set; }
}
public class ReviewsGetDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; }
    public int ProductId { get; set; }
    public double Ratings { get; set; }
    public string Comments { get; set; }
}
public class ReviewsCreateDto
{
    //public int Id { get; set; }
    public int UserId { get; set; }
    public int ProductId { get; set; }
    public double Ratings { get; set; }
    public string Comments { get; set; }
}
public class ReviewsUpdateDto
{
   // public int Id { get; set; }
    public int UserId { get; set; }
    public int ProductId { get; set; }
    public double Ratings { get; set; }
    public string Comments { get; set; }
}
public class ReviewsEntityTypeConfiguration : IEntityTypeConfiguration<Reviews>
{
    public void Configure(EntityTypeBuilder<Reviews> builder)
    {
        builder.ToTable("Reviews");
    }
}