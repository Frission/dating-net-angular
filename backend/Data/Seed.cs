using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Backend.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class Seed
{
    public static async Task SeedUsers(UserManager<AppUser> userManager)
    {
        if (await userManager.Users.AnyAsync())
            return;

        var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

#pragma warning disable CA1869 // Cache and reuse 'JsonSerializerOptions' instances
        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
#pragma warning restore CA1869 // Cache and reuse 'JsonSerializerOptions' instances
        var users = JsonSerializer.Deserialize<List<AppUser>>(userData, options);

        if (users == null)
        {
            Console.WriteLine("failed to parse user seed json");
            return;
        }

        foreach (var user in users)
        {
            using var hmac = new HMACSHA512();

            user.UserName = user.UserName?.ToLower();
            await userManager.CreateAsync(user, "Pa$$w0rd");
        }
    }
}
