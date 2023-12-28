using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.Data.Helpers;
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
        if (await UserExists(credentials.Username))
        {
            return BadRequest(new { Errors = new { UserName = "User name is already taken." } });
        }

        var computedHash = new ComputedHash(credentials.Password);

        var user = new AppUser
        {
            UserName = credentials.Username.ToLower(),
            PasswordHash = computedHash.Hash,
            PasswordSalt = computedHash.Salt
        };

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return user;
    }

    [HttpPost("login")]
    public async Task<ActionResult<AppUser>> LoginUser(LoginDTO credentials)
    {
        var user = await _context.Users.SingleOrDefaultAsync(user => user.UserName == credentials.Username);

        if (user == null)
            return Unauthorized(new { Errors = new { User = "User not found." } });

        var computedHash = new ComputedHash(credentials.Password, user.PasswordSalt);

        if (!ComputedHash.Compare(computedHash.Hash, user.PasswordHash))
        {
            return Unauthorized(new { Errors = new { Credentials = "Username or password is incorrect." } });
        }

        return user;
    }

    private async Task<bool> UserExists(string username)
    {
        return await _context.Users.AnyAsync(user => user.UserName.Equals(username.ToLower()));
    }
}
