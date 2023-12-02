using LearningStarter.Common;
using LearningStarter.Data;
using LearningStarter.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Runtime.CompilerServices;

namespace LearningStarter.Controllers;
[ApiController]
[Route("api/order")]

public class OrdersController : Controller
{
    private readonly DataContext _dataContext;
    public OrdersController(DataContext dataContext)
    {
        _dataContext = dataContext;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var response = new Response();
        var data = _dataContext.Set<Order>().Select(order => new OrderGetDto
        {
            Id = order.Id,
            UserId = order.UserId,
            Price = order.Price,
            Quantity = order.Quantity,
            Date = order.Date,
            Status = order.Status,
             OrderItems = order.OrderItems.Select(orderItem => new OrderItemGetDto
             {
                 Id = orderItem.Id,
                 OrderId = orderItem.OrderId,
                 ProductId = orderItem.ProductId,
                 Image= orderItem.Image,
                 Price = orderItem.Price,
                 Quantity = orderItem.Quantity
             }).ToList()
        }).ToList();
        response.Data = data;
        return Ok(response);

    }
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = new Response();
        var data = _dataContext
            .Set<Order>()
            .Select(order => new OrderGetDto
            {
                Id = order.Id,
                UserId = order.UserId,
                Price = order.Price,
                Quantity = order.Quantity,
                Date = order.Date,
                Status = order.Status,
                OrderItems = order.OrderItems.Select(orderItem => new OrderItemGetDto
                {
                    Id = orderItem.Id,
                    OrderId = orderItem.OrderId,
                    ProductId = orderItem.ProductId,
                    Image = orderItem.Image,
                    Price = orderItem.Price,
                    Quantity = orderItem.Quantity
                }).ToList()
            }).FirstOrDefault(order => order.Id == id);
        response.Data = data;
        return Ok(response);

    }
    [HttpPost]
    public IActionResult Create([FromBody] OrderCreateDto orderCreateDto)
    {
        var response = new Response();
        if (orderCreateDto.Price < 0)
        {
            response.AddError(nameof(orderCreateDto.Price), "Invalid Price");
        }
        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        var orderToCreate = new Order
        {
            //Id = orderCreateDto.Id,
            UserId = orderCreateDto.UserId,
            Price = orderCreateDto.Price,
            Quantity = orderCreateDto.Quantity,
            Date = orderCreateDto.Date,
            Status = orderCreateDto.Status,
            OrderItems = orderCreateDto.OrderItems.Select(orderItemDto => new OrderItem
            {
                Price = orderItemDto.Price,
                Quantity = orderItemDto.Quantity,
                Image= orderItemDto.Image,
                ProductId = orderItemDto.ProductId
            }).ToList()
        };
        _dataContext.Set<Order>().Add(orderToCreate);

        _dataContext.SaveChanges();

        var orderToResponse = new OrderGetDto
        {
            Id = orderToCreate.Id,
            UserId = orderToCreate.UserId,
            Price = orderToCreate.Price,
            Quantity = orderToCreate.Quantity,
            Date = orderToCreate.Date,
            Status = orderToCreate.Status,
            OrderItems = orderToCreate.OrderItems.Select(orderItem => new OrderItemGetDto
            {
                Id = orderItem.Id,
                OrderId = orderItem.OrderId,
                ProductId = orderItem.ProductId,
                Image = orderItem.Image,
                Price = orderItem.Price,
                Quantity = orderItem.Quantity
            }).ToList()
        };
        response.Data = orderToResponse;
        return Created("", response);
    }
    [HttpPut("{id}")]
    public IActionResult Update([FromBody] OrderUpdateDto updateDto, int id)
    {
        var response = new Response();
        if (updateDto.Price < 0)
        {
            response.AddError(nameof(updateDto.Price), "Invalid Price");

        }
        var orderToUpdate = _dataContext.Set<Order>()
            .FirstOrDefault(order => order.Id == id);
        if (orderToUpdate == null)
        {
            response.AddError("id", "Order not found");
        }
        if (response.HasErrors)
        {
            return BadRequest(response);
        }
        orderToUpdate.Quantity = updateDto.Quantity;
        orderToUpdate.Status = updateDto.Status;
        orderToUpdate.Price = updateDto.Price;
        _dataContext.SaveChanges();

        var orderToUpdateResponse = new OrderGetDto
        {
            Id = orderToUpdate.Id,
            UserId = orderToUpdate.UserId,
            Price = orderToUpdate.Price,
            Quantity = orderToUpdate.Quantity,
            Date = orderToUpdate.Date,
            Status = orderToUpdate.Status
        };

        response.Data = orderToUpdateResponse;
        return Ok(response);

    }
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var response = new Response();
        var orderToDelete = _dataContext.Set<Order>()
            .FirstOrDefault(order => order.Id == id);

        if (orderToDelete == null)
        {
            response.AddError("id", "Order not found");
        }
        if (response.HasErrors)
        {
            return BadRequest(response);
        };
        _dataContext.Set<Order>().Remove(orderToDelete);
        _dataContext.SaveChanges();

        response.Data = true;
        return Ok("Deleted Successfully");
    }

}

