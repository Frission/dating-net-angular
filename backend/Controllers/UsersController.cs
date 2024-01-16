using System.Security.Claims;
using AutoMapper;
using Backend.DTOs;
using Backend.Entities;
using Backend.Extensions;
using Backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Authorize]
public class UsersController(IUserRepository userRepository, IPhotoService photoService, IMapper mapper) : BaseApiController
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IPhotoService _photoService = photoService;
    private readonly IMapper _mapper = mapper;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers()
    {
        return Ok(await _userRepository.GetMembersAsync());
    }

    [HttpGet("{username}")] // /api/users/lisa
    public async Task<ActionResult<MemberDTO?>> GetUser(string username)
    {
        return await _userRepository.GetMemberAsync(username);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDTO memberUpdateDTO)
    {
        var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (username == null) return NotFound();

        var user = await _userRepository.GetUserByUsernameAsync(username);
        if (user == null) return NotFound();

        _mapper.Map(memberUpdateDTO, user);

        if (await _userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("Failed to update user.");
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDTO>> AddPhoto(IFormFile file)
    {
        var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return NotFound();

        var result = await _photoService.AddPhotoAsync(file);
        if (result.Error != null) return BadRequest(result.Error.Message);

        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId,
            IsMain = user.Photos.Count == 0 // this will be the main photo if the user has 0 photos
        };

        user.Photos.Add(photo);

        if (await _userRepository.SaveAllAsync())
        {
            return CreatedAtAction(
                nameof(GetUser),
                new { username = user.UserName },
                _mapper.Map<PhotoDTO>(photo)
            );
        }

        return BadRequest();
    }

    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int? photoId)
    {
        if (photoId == null) return BadRequest();

        var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());
        if (user == null) return NotFound();

        var photo = user.Photos.FirstOrDefault(photo => photo.Id == photoId);
        if (photo == null) return NotFound();

        if(photo.IsMain) return BadRequest("This is already your main photo.");
        
        var currentMain = user.Photos.FirstOrDefault(photo => photo.IsMain);
        if (currentMain != null) currentMain.IsMain = false;
        
        photo.IsMain = true;

        if (await _userRepository.SaveAllAsync()) return NoContent();

        return BadRequest("A problem occurred when setting the main photo.");
    }
}
