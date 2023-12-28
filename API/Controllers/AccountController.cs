using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(DataContext context) : BaseApiController
{
    private readonly DataContext _context = context;

    [HttpPost("register")] // POST: api/account/register
    public async Task<ActionResult<AppUser>> RegisterUser(RegisterUserDTO credentials)
    {
        if (await UserExists(credentials.UserName))
        {
            return BadRequest(new { Errors = new { UserName = "User name is already taken." } });
        }

        using var hmac = new HMACSHA512();

        var user = new AppUser
        {
            UserName = credentials.UserName.ToLower(),
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(credentials.Password)),
            PasswordSalt = hmac.Key
        };

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return user;
    }

    private async Task<bool> UserExists(string username)
    {
        return await _context.Users.AnyAsync(user => user.UserName.Equals(username.ToLower()));
    }
}
