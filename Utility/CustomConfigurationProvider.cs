using System.Text.Json;
using Utility;

public class CustomConfigurationProvider :
    Microsoft.Extensions.Configuration.ConfigurationProvider
{
    public override void Load()
    {
        Data = new Dictionary<string, string>
                {
                    {"API", "https://www.parts365.bg"},
                    {"Secret", "THIS IS JWT TOKENS SECRET, IT COULD BE ANY STRING RADOPARTS PARTS 365 BULGARIA VARNA AUTOCARPARTS"},
                    {"AllowedHosts", "*"},
                    {"ServerName", "db945330347.hosting-data.io" },
                    {"DatabaseName", "db945330347" },
                    {"UserId", "dbo945330347" },
                    {"Password", "Detelina_1967"},
                    {"AddressFrom",  "info@parts365.bg"},
                    {"Host", "smtp.ionos.co.uk"}
                };
        try
        {
            var text = File.ReadAllText(@"secrets.json");
            var options = new JsonSerializerOptions
            { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            var content = JsonSerializer.Deserialize<SecurityMetadata>
           (text, options);
            if (content != null)
            {
                Data = new Dictionary<string, string>
                        {
                            {"API", content.API},
                            {"Secret", content.Secret},
                            {"AllowedHosts", content.AllowedHosts},
                            {"ServerName", content.ServerName },
                            {"DatabaseName", content.DatabaseName },
                            {"UserId", content.UserId },
                            {"Password", content.Password},
                            {"AddressFrom", content.AddressFrom},
                            {"Host", content.Host}
                        };
            }
        }
        catch(Exception exception)
        {
            LoggerUtil.Log(exception);
        }
    }
}