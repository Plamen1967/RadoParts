using Azure.Core;
using Rado.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using TestProject.Models;

namespace TestProject.Utility
{
    public static class ModelsUtility
    {
        public static async Task<IEnumerable<ModelMin>> GetModelsByCompanyId(int companyId)
        {
            ModelMin[] modelMin;
            try
            {
                using (HttpClient httpClient = new HttpClient())
                {
                    HttpRequestMessage httpRequestMessage = new HttpRequestMessage()
                    {
                        Method = HttpMethod.Get,
                        RequestUri = new Uri($"{TestSettings.Instance.Host}/model/GetModelsByCompanyId?companyId={companyId}"),
                        Headers = {
                            {
                                HttpRequestHeader.Accept.ToString(), "application/json"
                            }
                        }
                    };
                    var result = httpClient.SendAsync(httpRequestMessage).Result;

                    modelMin = await result.Content.ReadFromJsonAsync<ModelMin[]>() ?? [];
                }
                return modelMin.ToArray();
            }
            catch (Exception ex)
            {
            }

            return Enumerable.Empty<ModelMin>();    

        } 
    }
}
