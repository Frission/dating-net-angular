using Microsoft.EntityFrameworkCore;

namespace Backend.Helpers;

public class PagedList<T>(IEnumerable<T> items, int count, int pageNumber, int pageSize)
    : List<T>(items)
{
    public int CurrentPage { get; set; } = pageNumber;
    public int TotalPages { get; set; } = (int)Math.Ceiling(count / (double)pageSize);
    public int PageSize { get; set; } = pageSize;
    public int TotalCount { get; set; } = count;

    public static async Task<PagedList<T>> CreateAsync(
        IQueryable<T> source,
        int pageNumber,
        int pageSize
    )
    {
        var count = await source.CountAsync();
        var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
        return new PagedList<T>(items, count, pageNumber, pageSize);
    }
}
