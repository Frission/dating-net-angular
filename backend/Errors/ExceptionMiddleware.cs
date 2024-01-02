using System.Text.Json;
using Microsoft.VisualBasic;

namespace Backend.Errors;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
{
    private readonly RequestDelegate _next = next;
    private readonly ILogger<ExceptionMiddleware> _logger = logger;
    private readonly IHostEnvironment _env = env;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "{Message}", ex.Message);
            context.Response.ContentType = "aplication/json";
            context.Response.StatusCode = 500;

            var response = _env.IsDevelopment() ?
                new ApiException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString()) :
                new ApiException(context.Response.StatusCode, ex.Message, "Internal Server Error");

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
