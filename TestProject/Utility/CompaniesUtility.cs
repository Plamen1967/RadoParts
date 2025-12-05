using Rado.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using TestProject.Models;

namespace TestProject.Utility
{
    public static class CompaniesUtility
    {
        public static async Task<IEnumerable<Company>> GetCompanies()
        {
            Company[] companies;
            try
            {
                using (HttpClient httpClient = new HttpClient())
                {
                    HttpRequestMessage httpRequestMessage = new HttpRequestMessage()
                    {
                        Method = HttpMethod.Get,
                        RequestUri = new Uri($"{TestSettings.Instance.Host}/company"),
                        Headers =
                        {
                            {
                                HttpRequestHeader.Accept.ToString(),
                                "application/json"
                            }
                        }
                    };

                    HttpResponseMessage result = httpClient.SendAsync(httpRequestMessage).Result;

                    companies = await result.Content.ReadFromJsonAsync<Company[]>() ?? [];

                }
                return companies.ToArray();
            }
            catch (Exception ex)
            {
            }

            return Enumerable.Empty<Company>();
        }
    }
}
