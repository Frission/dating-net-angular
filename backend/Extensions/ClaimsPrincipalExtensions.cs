using System.Security.Claims;

namespace Backend.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static string GetUsername(this ClaimsPrincipal user)
    {
        return user.FindFirst(ClaimTypes.Name)?.Value
            ?? throw new NullReferenceException("User name was null inside claims.");
    }

    public static int GetUserId(this ClaimsPrincipal user)
    {
        var id = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (id == null)
            throw new NullReferenceException("User id was null inside claims.");

        return int.Parse(id);
    }
}
