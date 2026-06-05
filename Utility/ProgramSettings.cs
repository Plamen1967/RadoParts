namespace Settings
{
    public static class ProgramSettings
    {
        public static string? ImageFolder { get; set; }
        public static int MaxPictures { get; set; }
        public static string? ConnectionString { get; set; }
        public static string Api { get; set; }
        public static string? LogFolder { get; set; }
        public static bool DevelopmentMode { get; set; }
        public static string? PictureHref { get; set; }
        public static string? WebRootFolder { get; set; }
        public static long MaxSize { get; set; }
    }
}
