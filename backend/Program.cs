using Backend.Data;
using Backend.Errors;
using Backend.Extensions;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// add all services the app needs
builder.Services.AddApplicationServices(builder.Configuration);

// add auth
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(configurePolicy =>
{
    configurePolicy.AllowAnyHeader().AllowAnyMethod().WithOrigins(["https://localhost:4200"]);
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var dataContext = services.GetRequiredService<DataContext>();
    await dataContext.Database.MigrateAsync();
    await Seed.SeedUsers(dataContext);
}
catch (Exception ex)
{
    var logger = services.GetService<ILogger<Program>>();
    logger?.LogError(ex, "An error occurred during migration");
}

app.Run();
