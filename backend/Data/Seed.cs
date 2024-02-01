using System.Text.Json;
using Backend.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class Seed
{
    public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
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

        var roles = new List<AppRole>
        {
            new() { Name = "Member" },
            new() { Name = "Admin" },
            new() { Name = "Moderator" }
        };

        foreach (var role in roles)
        {
            await roleManager.CreateAsync(role);
        }

        var admin = new AppUser { UserName = "admin", SecurityStamp = Guid.NewGuid().ToString() };
        await userManager.CreateAsync(admin, "Pa$$w0rd");
        await userManager.AddToRolesAsync(admin, ["Admin", "Moderator"]);

        foreach (var user in users)
        {
            user.UserName = user.UserName?.ToLower();
            await userManager.CreateAsync(user, "Pa$$w0rd");
            await userManager.AddToRoleAsync(user, "Member");
        }
    }
}
