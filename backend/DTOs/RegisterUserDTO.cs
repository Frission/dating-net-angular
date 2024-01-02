using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public class RegisterUserDTO
{
    [Required]
    [StringLength(maximumLength: 100, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;
    [Required]
    [StringLength(maximumLength: 8, MinimumLength = 4)]
    public string Password { get; set; } = string.Empty;
}
