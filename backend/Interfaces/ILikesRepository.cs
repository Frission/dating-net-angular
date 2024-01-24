using Backend.DTOs;
using Backend.Entities;

namespace Backend.Interfaces;

public interface ILikesRepository
{
    public Task<UserLike?> GetUserLike(int sourceUserId, int targerUserId);
    public Task<IEnumerable<LikeDTO>> GetUserLikes(string predicate, int userId);

    public Task<AppUser?> GetUserWithLikes(int userId);
}