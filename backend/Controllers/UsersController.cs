using AutoMapper;
using Backend.Data;
using Backend.DTOs;
using Backend.Entities;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[Authorize]
public class UsersController(IUserRepository userRepository, IMapper mapper) : BaseApiController
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IMapper _mapper = mapper;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers()
    {
        var users = await _userRepository.GetUsersAsync();
        var response = _mapper.Map<IEnumerable<MemberDTO>>(users);
        return Ok(response);
    }

    [HttpGet("{username}")] // /api/users/lisa
    public async Task<ActionResult<MemberDTO?>> GetUser(string username)
    {
        var user = await _userRepository.GetUserByUsernameAsync(username);
        return _mapper.Map<MemberDTO>(user);
    }
}
