using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public class MessageDTO
{
    public int Id { get; set; }
    public int SenderId { get; set; }
    [Required]
    public string SenderUsername { get; set; } = string.Empty;
    public string? SenderPhotoUrl { get; set; }
    public int RecipientId { get; set; }
    [Required]
    public string RecipientUsername { get; set; } = string.Empty;
    public string? RecipientPhotoUrl { get; set; }
    [Required]
    public string Content { get; set; } = string.Empty;
    public DateTime? DateRead { get; set; }
    public DateTime MessageSent { get; set; }
}