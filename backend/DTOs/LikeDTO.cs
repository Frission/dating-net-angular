namespace Backend.DTOs;

public class LikeDTO
{
    public int Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int Age { get; set; }
    public string? KnownAs { get; set; }
    public string? City { get; set; }
    public string? PhotoUrl { get; set; }

    public static class Predicates
    {
        public const string Liked = "liked";
        public const string LikedBy = "likedBy";
    }
}
