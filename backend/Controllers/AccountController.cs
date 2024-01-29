using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Backend.Data;
using Backend.Data.Helpers;
using Backend.DTOs;
using Backend.Entities;
using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

public class AccountController(DataContext context, ITokenService tokenService, IMapper mapper) : BaseApiController
{
    private readonly DataContext _context = context;
    private readonly ITokenService _tokenService = tokenService;
    private readonly IMapper _mapper = mapper;

    [HttpPost("register")] // POST: api/account/register
    public async Task<ActionResult<UserDTO>> RegisterUser(RegisterUserDTO credentials)
    {
        if (await UserExists(credentials.Username))
        {
            return BadRequest(new { Errors = new { UserName = "User name is already taken." } });
        }

        var user = _mapper.Map<AppUser>(credentials);

        user.UserName = credentials.Username.ToLower();

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();

        return new UserDTO
        {
            Username = user.UserName,
            KnownAs = user.KnownAs,
            Token = _tokenService.CreateToken(user),
            Gender = user.Gender
        };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDTO>> LoginUser(LoginDTO credentials)
    {
        var user = await _context
            .Users.Include(user => user.Photos)
            .SingleOrDefaultAsync(user => user.UserName == credentials.Username);

        if (user == null || user.UserName == null)
            return Unauthorized(new { Errors = new { User = "User not found." } });

        return new UserDTO
        {
            Username = user.UserName,
            KnownAs = user.KnownAs,
            Token = _tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(photo => photo.IsMain)?.Url,
            Gender = user.Gender
        };
    }

    private async Task<bool> UserExists(string username)
    {
        return await _context.Users.AnyAsync(user => (user.UserName ?? "").Equals(username.ToLower()));
    }
}
