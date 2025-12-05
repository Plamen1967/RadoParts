using Azure.Core.Pipeline;
using Microsoft.Playwright;
using Models.Models;
using Rado.Models;
using System.Net;
using System.Text;
using System.Text.Json;
using TestProject.Models;
using TestProject.Utility;

namespace TestProject;

[TestClass]
public class TestCars
{
    
    [TestMethod]
    public async Task AddCars()
    {
        await Login.Execute();

        var carInput = new
        {
            company = "Audi",
            model = "100 Coupe",
            modification = "1.9 (112 Hp)",
            regName = "Car 1",
        };

        Car car = new Car();
        using (HttpClient httpClient = new HttpClient())
        {
            HttpRequestMessage httpRequestMessage = new HttpRequestMessage()
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri($"{TestSettings.Instance.Host}/add/carInput"),
                Headers = {
                    { HttpRequestHeader.Authorization.ToString(), $"Bearer {TestSettings.Instance.Token}" },
                    { HttpRequestHeader.Accept.ToString(), "application/json" }
                }
            };

            IEnumerable<Company> companies = CompaniesUtility.GetCompanies().Result;
            Company company = companies.First(company => company.companyName == carInput.company);

            IEnumerable<ModelMin> models = ModelsUtility.GetModelsByCompanyId(company.companyId).Result;
            ModelMin model = models.First(model => model.modelName == carInput.model);

            IEnumerable<ModificationMin> modifications = ModificationsUtility.GetModifications(model.modelId).Result;
            ModificationMin modification = modifications.First(modification => modification.modificationName == carInput.modification);

            car.modificationId = modification.modificationId;
            car.regNumber = carInput.regName;

            var carContent = new StringContent(JsonSerializer.Serialize(car), Encoding.UTF8, "application/json");
            HttpRequestMessage carRequest = new HttpRequestMessage()
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri($"{TestSettings.Instance.Host}/car"),
                Content = carContent,
                Headers =
                {
                    { HttpRequestHeader.Authorization.ToString(), $"Bearer {TestSettings.Instance.Token}" },
                    {HttpRequestHeader.Accept.ToString(), "application/json" }
                }
            };

            var result = httpClient.SendAsync(carRequest).Result;
        }
    }
}
