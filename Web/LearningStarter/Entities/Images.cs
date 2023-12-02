using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LearningStarter.Entities;

public class Images
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public byte[] Data { get; set; }
    public Product Product { get; set; }
}
public class ImageGetDto
{
    public int Id { get; set; }

    public byte[] Data { get; set; }
}
public class ImageCreateDto
{
    public string Data { get; set; }
}