using Rado.Models;
using System.Net;
using System.Net.Http.Json;
using TestProject.Models;

namespace TestProject.Utility
{
    static class ModificationsUtility
    {
        public static async Task<IEnumerable<ModificationMin>> GetModifications(int modelId)
        {
            try
            {
                ModificationMin[] modifications;

                using (HttpClient httpClient = new HttpClient())
                {
                    HttpRequestMessage httpRequestMessage = new HttpRequestMessage()
                    {
                        Method = HttpMethod.Get,
                        RequestUri = new Uri($"{TestSettings.Instance.Host}/modification/{modelId}"),
                        Headers = {
                        {
                            HttpRequestHeader.Accept.ToString(), "application/json"
                        }
                    }

                    };

                    var result = httpClient.SendAsync(httpRequestMessage).Result;
                    modifications =
                        await result.Content.ReadFromJsonAsync<ModificationMin[]>() ?? [];

                    return modifications.ToArray();
                }
            }
            catch (Exception exception)
            {
            }

            return Enumerable.Empty<ModificationMin>();
        }
    }
}
