using Backend.DTOs;
using Backend.Entities;
using Backend.Extensions;
using Backend.Helpers;
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

    public async Task<PagedList<LikeDTO>> GetUserLikes(LikesParams paginationParams)
    {
        var users = _context.Users.OrderBy(user => user.UserName).AsQueryable();
        var likes = _context.Likes.AsQueryable();

        if (paginationParams.Predicate == LikeDTO.Predicates.Liked)
        {
            likes = likes.Where(like => like.SourceUserId == paginationParams.UserId);
            users = likes.Select(like => like.TargetUser);
        }
        else if (paginationParams.Predicate == LikeDTO.Predicates.LikedBy)
        {
            likes = likes.Where(like => like.TargetUserId == paginationParams.UserId);
            users = likes.Select(like => like.SourceUser);
        }

        var likedUsers = users
            .Select(user => new LikeDTO
            {
                UserName = user.UserName,
                KnownAs = user.KnownAs,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = (
                    user.Photos.FirstOrDefault(photo => photo.IsMain) ?? new Photo { Url = null! }
                ).Url,
                City = user.City,
                Id = user.Id
            })
            .AsQueryable();

        return await PagedList<LikeDTO>.CreateAsync(
            likedUsers,
            paginationParams.PageNumber,
            paginationParams.PageSize
        );
    }

    public async Task<AppUser?> GetUserWithLikes(int userId)
    {
        return await _context
            .Users.Include(user => user.LikedUsers)
            .FirstOrDefaultAsync(user => user.Id == userId);
    }
}
