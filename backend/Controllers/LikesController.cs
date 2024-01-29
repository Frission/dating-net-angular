using Backend.DTOs;
using Backend.Entities;
using Backend.Extensions;
using Backend.Helpers;
using Backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

public class LikesController(IUserRepository userRepository, ILikesRepository likesRepository)
    : BaseApiController
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly ILikesRepository _likesRepository = likesRepository;

    [HttpPost("{username}")]
    public async Task<ActionResult> AddLike(string username)
    {
        var sourceUserId = User.GetUserId();
        var likedUser = await _userRepository.GetUserByUsernameAsync(username);
        var sourceUser = await _likesRepository.GetUserWithLikes(sourceUserId);

        if (likedUser == null)
            return NotFound();
        if (sourceUser == null)
            return NotFound();
        if (sourceUser.UserName == username)
            return BadRequest("You cannot like yourself.");

        var userLike = await _likesRepository.GetUserLike(sourceUserId, likedUser.Id);

        if (userLike != null)
            return BadRequest("You already liked this user.");

        userLike = new UserLike { SourceUserId = sourceUserId, TargetUserId = likedUser.Id };

        sourceUser.LikedUsers.Add(userLike);
        if (await _userRepository.SaveAllAsync())
            return Ok();

        return BadRequest("Failed to like user.");
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LikeDTO>>> GetUserLikes(
        [FromQuery] LikesParams paginationParams
    )
    {
        paginationParams.UserId = User.GetUserId();

        var users = await _likesRepository.GetUserLikes(paginationParams);

        Response.AddPaginationHeader(
            new PaginationHeader(
                users.CurrentPage,
                users.PageSize,
                users.TotalCount,
                users.TotalPages
            )
        );

        return Ok(users);
    }
}
