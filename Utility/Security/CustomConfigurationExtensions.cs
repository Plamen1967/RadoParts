using Microsoft.Extensions.Configuration;
using System;

public static class CustomConfigurationExtensions
{
    public static IConfigurationBuilder AddSecurityConfiguration
    (this IConfigurationBuilder builder)
    {
        return builder.Add(new CustomConfigurationSource());
    }
}