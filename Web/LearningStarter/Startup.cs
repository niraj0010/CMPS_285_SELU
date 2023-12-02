using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using IdentityModel;
using LearningStarter.Data;
using LearningStarter.Entities;
using LearningStarter.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace LearningStarter;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    private IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddCors();
        services.AddControllers();

        services.AddHsts(options =>
        {
            options.MaxAge = TimeSpan.MaxValue;
            options.Preload = true;
            options.IncludeSubDomains = true;
        });

        services.AddDbContext<DataContext>(options =>
        {
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));

        });

        services.AddIdentity<User, Role>(
                options =>
                {
                    options.SignIn.RequireConfirmedAccount = false;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireLowercase = false;
                    options.Password.RequireUppercase = false;
                    options.Password.RequireDigit = false;
                    options.Password.RequiredLength = 8;
                    options.ClaimsIdentity.UserIdClaimType = JwtClaimTypes.Subject;
                    options.ClaimsIdentity.UserNameClaimType = JwtClaimTypes.Name;
                    options.ClaimsIdentity.RoleClaimType = JwtClaimTypes.Role;
                })
            .AddEntityFrameworkStores<DataContext>();

        services.AddMvc();

        services
            .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie(options =>
            {
                options.Events.OnRedirectToLogin = context =>
                {
                    context.Response.StatusCode = 401;
                    return Task.CompletedTask;
                };
            });

        services.AddAuthorization();

        // Swagger
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Learning Starter Server",
                Version = "v1",
                Description = "Description for the API goes here.",
            });

            c.CustomOperationIds(apiDesc => apiDesc.TryGetMethodInfo(out var methodInfo) ? methodInfo.Name : null);
            c.MapType(typeof(IFormFile), () => new OpenApiSchema { Type = "file", Format = "binary" });
        });

        services.AddSpaStaticFiles(config =>
        {
            config.RootPath = "learning-starter-web/build";
        });

        services.AddHttpContextAccessor();

        // configure DI for application services
        services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        services.AddScoped<IAuthenticationService, AuthenticationService>();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, DataContext dataContext)
    {
        dataContext.Database.EnsureDeleted();
        dataContext.Database.EnsureCreated();
        
        app.UseHsts();
        app.UseHttpsRedirection();
        app.UseStaticFiles(); 
        app.UseSpaStaticFiles();
        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();

        // global cors policy
        app.UseCors(x => x
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());

        // Enable middleware to serve generated Swagger as a JSON endpoint.
        app.UseSwagger(options =>
        {
            options.SerializeAsV2 = true;
        });

        // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
        // specifying the Swagger JSON endpoint.
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Learning Starter Server API V1");
        });

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(x => x.MapControllers());

        app.UseSpa(spa =>
        {
            spa.Options.SourcePath = "learning-starter-web";
            if (env.IsDevelopment())
            {
                spa.UseProxyToSpaDevelopmentServer("http://localhost:3001");
            }
        });
        
        using var scope = app.ApplicationServices.CreateScope();
        var userManager = scope.ServiceProvider.GetService<UserManager<User>>();

        SeedUsers(dataContext, userManager).Wait();
        SeedProducts(dataContext).Wait();
    }
    private static async Task SeedUsers(DataContext dataContext, UserManager<User> userManager)
    {
        var numUsers = dataContext.Users.Count();

        if (numUsers == 0)
        {
            var seededUser = new User
            {
                FirstName = "Seeded",
                LastName = "User",
                UserName = "admin",
                Email = "admin.admin@selu.edu"
            };
            var seededUser1 = new User
            {
                FirstName = "Subin",
                LastName = "Bista",
                UserName = "Subin09",
                Email = "subin.bista@selu.edu"
            };

            var seededUser2 = new User
            {
                FirstName = "jane",
                LastName = "Smith",
                UserName = "jane.smith",
                Email = "jane.smith@selu.edu"
            };

            await userManager.CreateAsync(seededUser, "Password");
            await userManager.CreateAsync(seededUser1, "Password1");
            await userManager.CreateAsync(seededUser2, "Password2");
            await dataContext.SaveChangesAsync();
        }
    }
    private static async Task SeedProducts(DataContext dataContext)
{
        if (dataContext.Set<Product>().Any()){
            return;
        }

    
        var product1 = new Product
        {
            UserId = 1, 
            ProductCategories = "Electronics",
            Name = "Airpod",
            Description = "Airpord for sale used only for 1 month",
            Price = 99.99m,
            Status = "Excellent",
            DateAdded = DateTimeOffset.UtcNow,
            UserName = "admin",
            Images = new List<Images>
            {
                new Images { Data = GetImageBytes("ProductImage/airpod.jpg") },
            }
        };

        var product2 = new Product
        {
            UserId = 2,
            ProductCategories = "Electronics",
            Name = "Google Pixel 6A",
            Description = "Gently used Google Pixel 6A available for purchase, in excellent condition with no scratches. Appears almost new, used for a duration of 7 months.",
            Price = 199.99m,
            Status = "Good",
            DateAdded = DateTimeOffset.UtcNow,
            UserName = "Subin09",
            Images = new List<Images>
            {
                new Images { Data = GetImageBytes("ProductImage/googlepixel6a.jpg") }
            }
        };
        var product3 = new Product
        {
            UserId = 2,
            ProductCategories = "Clothing And Accessories",
            Name = "T - Shirts",
            Description = "Brand-new shirt for sale in impeccable condition, appearing as if it has never been worn.",
            Price = 19.99m,
            Status = "Excellent",
            DateAdded = DateTimeOffset.UtcNow,
            UserName = "Subin09",
            Images = new List<Images>
            {
                new Images { Data = GetImageBytes("ProductImage/nike.jpg") },
                new Images { Data = GetImageBytes("ProductImage/shirts.jpg") }
            }
        };

        var product4 = new Product
        {
            UserId = 3,
            ProductCategories = "Furniture And HomeDecor",
            Name = "Table",
            Description = "For sale: Wooden table, must be sold and needs to be taken away promptly.",
            Price = 49.99m,
            Status = "Excellent",
            DateAdded = DateTimeOffset.UtcNow,
            UserName = "jane.smith",
            Images = new List<Images>
            {
                new Images { Data = GetImageBytes("ProductImage/table.jpg") },
                new Images { Data = GetImageBytes("ProductImage/tables.jpg") }
            }
        };
        var product5 = new Product
        {
            UserId = 2,
            ProductCategories = "Electronics",
            Name = "Laptop",
            Description = "Powerful laptop for development.",
            Price = 499.99m,
            Status = "Excellent",
            DateAdded = DateTimeOffset.UtcNow,
            UserName = "Subin09",
            Images = new List<Images>
            {
                new Images { Data = GetImageBytes("ProductImage/laptop.jpg") },
            }
        };
        var product6 = new Product
        {
            UserId = 3,
            ProductCategories = "Furniture And HomeDecor",
            Name = "Bed",
            Description = "For sale: new full-size bed, must go soon.",
            Price = 79.99m,
            Status = "fair",
            DateAdded = DateTimeOffset.UtcNow,
            UserName = "jane.smith",
            Images = new List<Images>
            {
                new Images { Data = GetImageBytes("ProductImage/bed.jpg") },
            }
        };
        var product7 = new Product
        {
            UserId = 2,
            ProductCategories = "Electronics",
            Name = "Gaming Pc",
            Description = "Offering a gaming PC for sale, as my son is no longer using it. Take advantage of this limited-time opportunity to make a purchase.",
            Price = 229.99m,
            Status = "Good",
            DateAdded = DateTimeOffset.UtcNow,
            UserName = "Subin09",
            Images = new List<Images>
            {
                new Images { Data = GetImageBytes("ProductImage/gaming.jpg") },
            }
        };
        
        dataContext.Set<Product>().AddRange(product1, product2, product3,product4,product5,product6,product7);
        await dataContext.SaveChangesAsync();
    
    }
    private static byte[] GetImageBytes(string relativePath)
    {
        string rootDirectory = Directory.GetCurrentDirectory();
        string fullPath = Path.Combine(rootDirectory, relativePath);


        if (!File.Exists(fullPath))
        {
            throw new FileNotFoundException($"The image file at '{fullPath}' does not exist.");
        }

        byte[] imageData;
        using (FileStream fileStream = File.OpenRead(fullPath))
        {
            using (MemoryStream memoryStream = new MemoryStream())
            {
                fileStream.CopyTo(memoryStream);
                imageData = memoryStream.ToArray();
            }
        }

        return imageData;
    }



}
