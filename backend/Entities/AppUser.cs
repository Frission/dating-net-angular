using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
}
