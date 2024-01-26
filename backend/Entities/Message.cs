using System.ComponentModel.DataAnnotations;

namespace Backend.Entities;

public class Message
{
    public int Id { get; set; }
    public int SenderId { get; set; }
    [Required]
    public string SenderUsername { get; set; } = string.Empty;
    [Required]
    public AppUser Sender { get; set; } = null!;
    public int RecipientId { get; set; }
    [Required]
    public string RecipientUsername { get; set; } = string.Empty;
    [Required]
    public AppUser Recipient { get; set; } = null!;
    [Required]
    public string Content { get; set; } = string.Empty;
    public DateTime? DateRead { get; set; }
    public DateTime MessageSent { get; set; } = DateTime.UtcNow;
    public bool SenderDeleted { get; set; }
    public bool RecipientDeleted { get; set; }
}