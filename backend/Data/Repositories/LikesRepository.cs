using Backend.DTOs;
using Backend.Entities;
using Backend.Extensions;
using Backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data.Repositories;

public class LikesRepository(DataContext context) : ILikesRepository
{
    private readonly DataContext _context = context;

    public async Task<UserLike?> GetUserLike(int sourceUserId, int targerUserId)
    {
        return await _context.Likes.FindAsync(sourceUserId, targerUserId);
    }

    public async Task<IEnumerable<LikeDTO>> GetUserLikes(string predicate, int userId)
    {
        var users = _context.Users.OrderBy(user => user.UserName).AsQueryable();
        var likes = _context.Likes.AsQueryable();

        if (predicate == LikeDTO.Predicates.Liked)
        {
            likes = likes.Where(like => like.SourceUserId == userId);
            users = likes.Select(like => like.TargetUser);
        }
        else if (predicate == LikeDTO.Predicates.LikedBy)
        {
            likes = likes.Where(like => like.TargetUserId == userId);
            users = likes.Select(like => like.SourceUser);
        }

        return await users.Select(user => new LikeDTO
        {
            UserName = user.UserName,
            KnownAs = user.KnownAs,
            Age = user.DateOfBirth.CalculateAge(),
            PhotoUrl = (user.Photos.FirstOrDefault(photo => photo.IsMain) ?? new Photo{ Url = null! }).Url,
            City = user.City,
            Id = user.Id
        }).ToListAsync();
    }

    public async Task<AppUser?> GetUserWithLikes(int userId)
    {
        return await _context.Users
            .Include(user => user.LikedUsers)
            .FirstOrDefaultAsync(user => user.Id == userId);
    }
}
