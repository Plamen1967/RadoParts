// See https://aka.ms/new-console-template for more information
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using Utility;

string name = Environment.GetCommandLineArgs()[1];
System.Drawing.Image img = System.Drawing.Image.FromFile(string.Concat(name));
ImageManager.ResizeImage(img, new Size(500, 500));
img.Save("logo.gif", ImageFormat.Gif);
; Console.WriteLine("Hello, World!");
