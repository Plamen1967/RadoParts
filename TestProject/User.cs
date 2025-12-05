using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Rado.Models;
using System.IO;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using TestProject.Models;
using TestProject.Utility;

namespace TestProject;

[TestClass]
public class User
{
    [TestMethod]
    public async Task LogIn()
    {
        await Login.Execute();

        using (HttpClient client = new HttpClient())
        {
            HttpRequestMessage httpRequestMessage = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri($"{TestSettings.Instance.Host}/car/GetCars"),
                Headers = {
            { HttpRequestHeader.Authorization.ToString(), $"Bearer {TestSettings.Instance.Token}" },
            { HttpRequestHeader.Accept.ToString(), "application/json" } }
            };

            try
            {
                var result = client.SendAsync(httpRequestMessage).Result;

                CarView[]? carViews = await result.Content.ReadFromJsonAsync<CarView[]>();
            }
            catch (Exception exception)
            {

            }
        }
    }
}
