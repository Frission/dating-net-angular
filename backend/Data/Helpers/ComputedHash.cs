using System.Security.Cryptography;
using System.Text;

namespace Backend.Data.Helpers;

readonly struct ComputedHash(byte[] hash, byte[] salt)
{
    public readonly byte[] Hash = hash;
    public readonly byte[] Salt = salt;

    public ComputedHash(string password) : this(hash: [], salt: [])
    {
        using var hmac = new HMACSHA512();

        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

        Hash = hash;
        Salt = hmac.Key;
    }

    public ComputedHash(string password, byte[] passwordSalt) : this(hash: [], salt: passwordSalt)
    {
        using var hmac = new HMACSHA512(passwordSalt);

        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

        Hash = hash;
        Salt = hmac.Key;
    }

    public static bool Compare(byte[] firstHash, byte[] secondHash)
    {
        if (firstHash.Length < 1 || secondHash.Length < 1)
            return false;

        for (int i = 0; i < firstHash.Length && i < secondHash.Length; i++)
        {
            if (firstHash[i] != secondHash[i])
                return false;
        }

        return true;
    }
}
