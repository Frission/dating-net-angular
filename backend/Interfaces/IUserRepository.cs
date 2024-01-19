using Backend.DTOs;
using Backend.Entities;
using Backend.Helpers;

namespace Backend.Interfaces;

public interface IUserRepository
{
    void Update(AppUser user);
    Task<bool> SaveAllAsync();
    Task<IEnumerable<AppUser>> GetUsersAsync();
    Task<AppUser?> GetUserByIdAsync(int id);
    Task<AppUser?> GetUserByUsernameAsync(string username);
    Task<PagedList<MemberDTO>> GetMembersAsync(PaginationParams userParams);
    Task<MemberDTO?> GetMemberAsync(string username);
}