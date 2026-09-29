namespace KohTaoBack.Services
{
    public static class PasswordPolicy
    {
        public const int MinLongitud = 12;
        public const int WorkFactor = 12;

        public static string Hash(string password) => BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);

        public static bool Verificar(string password, string hash) => BCrypt.Net.BCrypt.Verify(password, hash);
    }
}
