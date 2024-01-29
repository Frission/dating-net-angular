using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public class RegisterUserDTO
{
    [Required]
    [StringLength(maximumLength: 100, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string KnownAs { get; set; } = null!;

    [Required]
    public string Gender { get; set; } = null!;

    [Required]
    public DateOnly? DateOfBirth { get; set; }

    [Required]
    public string City { get; set; } = null!;

    [Required]
    public string Country { get; set; } = null!;

    [Required]
    [StringLength(maximumLength: 8, MinimumLength = 4)]
    public string Password { get; set; } = string.Empty;
}
