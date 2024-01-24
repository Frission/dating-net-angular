using System.ComponentModel.DataAnnotations;

namespace Backend.Entities;

public class UserLike
{
    [Required]
    public AppUser SourceUser { get; set; } = null!;
    [Required]
    public int SourceUserId { get; set; }
    [Required]
    public AppUser TargetUser { get; set; } = null!;
    [Required]
    public int TargetUserId { get; set; }
}