using Backend.DTOs;
using Backend.Entities;
using Backend.Helpers;

namespace Backend.Interfaces;

public interface ILikesRepository
{
    public Task<UserLike?> GetUserLike(int sourceUserId, int targerUserId);
    public Task<PagedList<LikeDTO>> GetUserLikes(LikesParams paginationParams);

    public Task<AppUser?> GetUserWithLikes(int userId);
}
