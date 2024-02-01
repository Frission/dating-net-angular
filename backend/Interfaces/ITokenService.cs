using Backend.Entities;

namespace Backend.Interfaces;

public interface ITokenService
{
    Task<string> CreateToken(AppUser user);
}
