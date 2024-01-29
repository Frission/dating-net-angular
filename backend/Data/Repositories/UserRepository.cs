using AutoMapper;
using AutoMapper.QueryableExtensions;
using Backend.DTOs;
using Backend.Entities;
using Backend.Helpers;
using Backend.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data.Repositories;

public class UserRepository(DataContext context, IMapper mapper) : IUserRepository
{
    private readonly DataContext _context = context;
    private readonly IMapper _mapper = mapper;

    public async Task<AppUser?> GetUserByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<AppUser?> GetUserByUsernameAsync(string username)
    {
        return await _context
            .Users.Include(user => user.Photos)
            .SingleOrDefaultAsync(x => x.UserName == username);
    }

    public async Task<IEnumerable<AppUser>> GetUsersAsync()
    {
        return await _context.Users.Include(user => user.Photos).ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }

    public void Update(AppUser user)
    {
        _context.Entry(user).State = EntityState.Modified;
    }

    public async Task<MemberDTO?> GetMemberAsync(string username)
    {
        return await _context
            .Users.Where(x => x.UserName == username)
            .ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
    }

    public async Task<PagedList<MemberDTO>> GetMembersAsync(UserParams paginationParams)
    {
        var query = _context.Users.AsQueryable();

        query = query.Where(user => user.UserName != paginationParams.CurrentUsername);
        query = query.Where(user => user.Gender == paginationParams.Gender);

        var minDateofBirth = DateOnly.FromDateTime(
            DateTime.Today.AddYears(-paginationParams.MaxAge - 1)
        );
        var maxDateofBirth = DateOnly.FromDateTime(
            DateTime.Today.AddYears(-paginationParams.MinAge)
        );

        query = query.Where(user =>
            user.DateOfBirth >= minDateofBirth && user.DateOfBirth <= maxDateofBirth
        );
        query = paginationParams.OrderBy switch
        {
            "created" => query.OrderByDescending(user => user.Created),
            _ => query.OrderByDescending(user => user.LastActive)
        };

        return await PagedList<MemberDTO>.CreateAsync(
            query.AsNoTracking().ProjectTo<MemberDTO>(_mapper.ConfigurationProvider),
            paginationParams.PageNumber,
            paginationParams.PageSize
        );
    }
}
