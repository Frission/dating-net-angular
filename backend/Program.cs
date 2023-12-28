using Backend.Extensions;

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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(configurePolicy =>
{
    configurePolicy
        .AllowAnyHeader()
        .AllowAnyMethod()
        .WithOrigins(["https://localhost:4200"]);
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
