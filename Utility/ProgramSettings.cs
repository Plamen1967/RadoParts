namespace Settings
{
    public static class ProgramSettings
    {
        static public string? ImageFolder { get; set; }
        static public int MaxPictures { get; set; }
        static public string? ConnectionString { get; set; }
        static public string Api { get; set; }
        static public string? LogFolder { get; set; }
        static public bool DevelopmentMode { get; set; }
        static public string? PictureHref { get; set; }
        static public string? WebRootFolder { get; set; }
        static public long MaxSize { get; set; }
    }
}
