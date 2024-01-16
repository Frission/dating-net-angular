namespace Backend.Helpers;

public static class CloudinarySettings
{
    public static string CloudName { get => Environment.GetEnvironmentVariable("CLOUDINARY_ACCOUNT_NAME") ?? ""; }
    public static string ApiKey { get => Environment.GetEnvironmentVariable("CLOUDINARY_ACCOUNT_KEY") ?? ""; }
    public static string ApiSecret { get => Environment.GetEnvironmentVariable("CLOUDINARY_ACCOUNT_SECRET") ?? ""; }
}