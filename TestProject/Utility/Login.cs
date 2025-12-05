using Rado.Models.Authentication;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using TestProject.Models;
using static Microsoft.ApplicationInsights.MetricDimensionNames.TelemetryContext;

namespace TestProject.Utility
{
    public static class Login
    {
        public static async Task<bool> Execute()
        {
            try
            {
                using StringContent userData = new(JsonSerializer.Serialize(new
                {
                    password = TestSettings.Instance.Password,
                    userName = TestSettings.Instance.Username
                }),
                Encoding.UTF8,
                "application/json");

                using (HttpClient httpClient = new HttpClient())
                {
                    using HttpResponseMessage response = await httpClient.PostAsync(
                        $"{TestSettings.Instance.Host}/users/autenticate",
                         userData);

                    if (response.IsSuccessStatusCode)
                    {
                        AuthenticatedUser? jsonResponse = await response.Content.ReadFromJsonAsync<AuthenticatedUser>();
                        if (jsonResponse != null)
                            TestSettings.Instance.Token = jsonResponse.token;
                        else 
                            return false;
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
