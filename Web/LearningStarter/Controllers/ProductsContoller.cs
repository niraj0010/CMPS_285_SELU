using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Validations;
using System;
using System.Linq;
using static System.Net.Mime.MediaTypeNames;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace LearningStarter.Controllers;
[Tags("Products")]
[ApiController]
[Route("api/products")]
public class ProductsContoller : ControllerBase
{
    private readonly DataContext _datacontext;
    public ProductsContoller(DataContext dataContext)
    {
        _datacontext = dataContext;

    }
    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();
        var data = _datacontext
            .Set<Product>().Include(product => product.User)
            .Select(product => new ProductGetDto
            {
                Id = product.Id,
                UserId = product.UserId,
                ProductCategories = product.ProductCategories,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Status = product.Status,
                UserName = product.User.UserName,
                DateAdded = product.DateAdded,
                Images = product.Images.Select(image => new ImageGetDto
                {
                    Id = image.Id,
                    Data = image.Data,
                }).ToList(),

            }).ToList();
        response.Data = data;
        return Ok(response);

    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();
        var data = _datacontext
            .Set<Product>().Include(product => product.User)
            .Select(product => new ProductGetDto
            {
                Id = product.Id,
                UserId = product.UserId,
                ProductCategories = product.ProductCategories,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                UserName= product.User.UserName,
                Status = product.Status,
                DateAdded = product.DateAdded,
                Images = product.Images.Select(image => new ImageGetDto
                {
                    Id = image.Id,
                    Data = image.Data,
                }).ToList()
            }).FirstOrDefault(product=>product.Id==id);
        if (data == null)
        {
            return NotFound();
        }

        response.Data = data;
        return Ok(response);

    }

    [HttpPost]
    public IActionResult Create([FromBody] ProductCreateDto createDto)
    {
        var response = new Response();

        if (string.IsNullOrEmpty(createDto.Name))
        {
            response.AddError(nameof(createDto.Name), "Name must not be empty");

        }

        if (createDto.Price < 0)
        {
            response.AddError(nameof(createDto.Price), "price must be positive");
        }
        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        var productTOcreate = new Product
        {
            Name = createDto.Name,
            UserId = createDto.UserId,
            ProductCategories = createDto.ProductCategories,
            Description = createDto.Description,
            Price = createDto.Price,
            UserName = createDto.UserName,
            Status = createDto.Status,
            DateAdded = createDto.DateAdded,

        };


        _datacontext.Set<Product>().Add(productTOcreate);
        _datacontext.SaveChanges();
        foreach (var imageDto in createDto.Images)
        {
            byte[] imageBytes = Convert.FromBase64String(imageDto.Data);
            var imageToCreate = new Images
            {
                Data = imageBytes,
                ProductId = productTOcreate.Id
            };
            _datacontext.Set<Images>().Add(imageToCreate);
        }


        _datacontext.SaveChanges();

        var productToReturn = new ProductGetDto
        {
            Id = productTOcreate.Id,
            UserId = productTOcreate.UserId,
            ProductCategories = productTOcreate.ProductCategories,
            Name = productTOcreate.Name,
            Description = productTOcreate.Description,
            Price = productTOcreate.Price,
            Status = productTOcreate.Status,
            DateAdded = productTOcreate.DateAdded,
            UserName= productTOcreate.UserName,
            Images = productTOcreate.Images.Select(image => new ImageGetDto
            {
                Id = image.Id,
                Data = image.Data,
            }).ToList()
        };
        response.Data = productToReturn;
        return Created("", response);
    }

    [HttpPut("{id}")]

    public IActionResult Update([FromBody] ProductUpdateDto updateDto, int id)
    {


        var response = new Response();
        if (string.IsNullOrEmpty(updateDto.Name))
        {
            response.AddError(nameof(updateDto.Name), "Name must not be empty");

        }

        if (updateDto.Price < 0)
        {
            response.AddError(nameof(updateDto.Price), "price must be positive");
        }

        var productToUpdate = _datacontext.Set<Product>()
            .FirstOrDefault(product => product.Id == id);

        if (productToUpdate == null)
        {
            response.AddError("id", "Product not found ");

        }
        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        productToUpdate.Name = updateDto.Name;
        productToUpdate.Description = updateDto.Description;
        productToUpdate.Price = updateDto.Price;
        productToUpdate.ProductCategories = updateDto.ProductCategories;
        productToUpdate.Status = updateDto.Status;
        productToUpdate.DateAdded = updateDto.DateAdded;
        productToUpdate.UserName = updateDto.UserName;

        if (updateDto.ImageIds != null)
        {
            var imagesToRemove = productToUpdate.Images
                .Where(image => !updateDto.ImageIds.Contains(image.Id))
                .ToList();
            foreach (var image in imagesToRemove)
            {
                productToUpdate.Images.Remove(image);
                _datacontext.Set<Images>().Remove(image);
            }
        }

        if (updateDto.Images != null)
        {
            foreach (var imageDto in updateDto.Images)
            {
                byte[] imageBytes = Convert.FromBase64String(imageDto.Data);
                var newImage = new Images
                {
                    Data = imageBytes,
                    ProductId = productToUpdate.Id,
                };
                productToUpdate.Images.Add(newImage);
                _datacontext.Set<Images>().Add(newImage);
            }
        }

        _datacontext.SaveChanges();

        var productToReturn = new ProductGetDto
        {
            Id = productToUpdate.Id,
            Name = productToUpdate.Name,
            UserId = productToUpdate.UserId,
            ProductCategories = productToUpdate.ProductCategories,
            Description = productToUpdate.Description,
            Price = productToUpdate.Price,
            Status = productToUpdate.Status,
            DateAdded = productToUpdate.DateAdded,
            UserName = productToUpdate.UserName,
            Images = productToUpdate.Images.Select(image => new ImageGetDto
            {
                Id = image.Id,
                Data = image.Data,
            }).ToList()
        };
        response.Data = productToReturn;
        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var response = new Response();
        var productToDelete = await _datacontext.Set<Product>()
            .FirstOrDefaultAsync(product => product.Id == id);

        if (productToDelete == null)
        {
            response.AddError("id", "Product not found ");
        }

        if (response.HasErrors)
        {
            return BadRequest(response);
        }

        await _datacontext.Entry(productToDelete).Collection(p => p.Reviews).LoadAsync();
        _datacontext.Set<Reviews>().RemoveRange(productToDelete.Reviews);

        _datacontext.Set<Product>().Remove(productToDelete);
        await _datacontext.SaveChangesAsync();

        response.Data = true;
        return Ok(response);
    }

}