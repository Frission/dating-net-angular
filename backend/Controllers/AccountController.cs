﻿using System.Security.Cryptography;
using System.Text;
using Backend.Data;
using Backend.Data.Helpers;
using Backend.DTOs;
using Backend.Entities;
using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

public class AccountController(DataContext context, ITokenService tokenService) : BaseApiController
{
    private readonly DataContext _context = context;
    private readonly ITokenService _tokenService = tokenService;

    [HttpPost("register")] // POST: api/account/register
    public async Task<ActionResult<UserDTO>> RegisterUser(RegisterUserDTO credentials)
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

        return new UserDTO
        {
            Username = user.UserName,
            Token = _tokenService.CreateToken(user)
        };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDTO>> LoginUser(LoginDTO credentials)
    {
        var user = await _context.Users.SingleOrDefaultAsync(user => user.UserName == credentials.Username);

        if (user == null)
            return Unauthorized(new { Errors = new { User = "User not found." } });

        var computedHash = new ComputedHash(credentials.Password, user.PasswordSalt);

        if (!ComputedHash.Compare(computedHash.Hash, user.PasswordHash))
        {
            return Unauthorized(new { Errors = new { Credentials = "Username or password is incorrect." } });
        }

        return new UserDTO
        {
            Username = user.UserName,
            Token = _tokenService.CreateToken(user)
        };
    }

    private async Task<bool> UserExists(string username)
    {
        return await _context.Users.AnyAsync(user => user.UserName.Equals(username.ToLower()));
    }
}
