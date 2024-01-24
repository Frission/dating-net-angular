using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Extensions;

namespace Backend.Entities;

[Table("Users")]
public class AppUser
{
    public int Id { get; set; }
    [Required]
    [StringLength(maximumLength: 100, MinimumLength = 3)]
    public string UserName { get; set; } = string.Empty;
    [Required]
    public byte[] PasswordHash { get; set; } = [];
    [Required]
    public byte[] PasswordSalt { get; set; } = [];
    public DateOnly DateOfBirth { get; set; }
    public string? KnownAs { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    public string? Gender { get; set; }
    public string? Introduction { get; set; }
    public string? Interests { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public List<Photo> Photos { get; set; } = [];

    public List<UserLike> LikedByUsers { get; set; } = [];
    public List<UserLike> LikedUsers { get; set; } = [];

    // public int GetAge()
    // {
    //     return DateOfBirth.CalculateAge();
    // }
}
