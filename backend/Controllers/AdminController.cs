using Backend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

public class AdminController(UserManager<AppUser> userManager) : BaseApiController
{
    private readonly UserManager<AppUser> _userManager = userManager;

    [Authorize(Policy = "RequireAdminRole")]
    [HttpGet("users-with-roles")]
    public async Task<ActionResult> GetUsersWithRoles()
    {
        var users = await _userManager
            .Users.OrderBy(user => user.UserName)
            .Select(user => new
            {
                user.Id,
                Username = user.UserName,
                Roles = user.UserRoles.Select(role => role.Role.Name)
            })
            .ToListAsync();

        return Ok(users);
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("edit-roles/{username}")]
    public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
    {
        if (string.IsNullOrEmpty(roles))
            return BadRequest("You must select at least one role.");

        var selectedRoles = roles.Split(",");
        var user = await _userManager.FindByNameAsync(username);

        if (user == null)
            return NotFound();

        var existingRoles = await _userManager.GetRolesAsync(user);
        var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(existingRoles));

        if (!result.Succeeded)
            return BadRequest("Failed to add to roles.");

        result = await _userManager.RemoveFromRolesAsync(user, existingRoles.Except(selectedRoles));

        if (!result.Succeeded)
            return BadRequest("Failed to remove from roles.");

        return Ok(await _userManager.GetRolesAsync(user));
    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpGet("photos-to-moderate")]
    public async Task<ActionResult> GetPhotosForModeration()
    {
        return Ok("Admin OR Moderator only.");
    }
}
