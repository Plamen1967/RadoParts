using FetchData.Model;
using System.Net.Http;
using System.Text.Json;
using System.Web;

namespace FetchData
{
    internal class Program
    {
        static void Main(string[] args)
        {
            string url = "  ";
            HttpClient httpClient = new HttpClient();
            var response = httpClient.GetAsync(url);
            response.Wait();
            HttpResponseMessage responseMessage = response.Result;
            var responseStr = responseMessage.Content.ReadAsStringAsync();
            responseStr.Wait();

            CompanyModels model = JsonSerializer.Deserialize<CompanyModels>(responseStr.Result);

        }
    }
}
