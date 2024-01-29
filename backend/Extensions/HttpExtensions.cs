using System.Text.Json;
using Backend.Helpers;

namespace Backend.Extensions;

public static class HttpExtensions
{
    private static readonly JsonSerializerOptions jsonOptions =
        new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

    public static void AddPaginationHeader(this HttpResponse response, PaginationHeader header)
    {
        response.Headers.Append("Pagination", JsonSerializer.Serialize(header, jsonOptions));
        response.Headers.Append("Access-Control-Expose-Headers", "Pagination");
    }
}
