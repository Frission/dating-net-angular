namespace Backend.Extensions;

public static class DateTimeExtensions
{
    /// <summary>
    /// Simple age calculation
    /// </summary>
    /// <returns>Age calculated from birth date</returns>
    public static int CalculateAge(this DateOnly dateOnly)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var age = today.Year - dateOnly.Year;
        if (dateOnly > today.AddYears(-1))
            age--;

        return age;
    }
}
