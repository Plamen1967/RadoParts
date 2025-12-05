using System.Net;
using TestProject.Models;
using TestProject.Utility;

namespace TestProject.Photos
{
    internal class TestPhotos
    {
        [TestMethod]
        public async Task UploadPhoto()
        {
            string path = @"D:\photos\18_Nov_2022.png";
            FileStream fs = File.OpenRead(path);
            var multiForm = new MultipartFormDataContent();
            multiForm.Add(new StreamContent(fs), "file", Path.GetFileName(path));
            multiForm.Add(new StringContent("1671207163330"), "partId");
            await Login.Execute();

            using (HttpClient client = new HttpClient())
            {
                using (HttpRequestMessage requestMessage = new HttpRequestMessage
                {
                    Method = HttpMethod.Post,
                    RequestUri = new Uri($"{TestSettings.Instance.Host}/image/upload"),
                    Headers = {
                    { HttpRequestHeader.Authorization.ToString(), $"Bearer {TestSettings.Instance.Token}" },
                    { HttpRequestHeader.Accept.ToString(), "multipart/form-data" }
                },
                    Content = multiForm
                })
                {
                    var result = client.SendAsync(requestMessage).Result;
                }

            }
        }
    }
}
