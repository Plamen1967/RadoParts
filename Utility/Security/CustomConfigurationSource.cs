using Microsoft.Extensions.Configuration;
using System;

public class CustomConfigurationSource : IConfigurationSource
{
    public IConfigurationProvider Build(IConfigurationBuilder builder) => new CustomConfigurationProvider();
}
