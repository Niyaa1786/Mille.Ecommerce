using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Mille.Application.Common.Interfaces;
using Mille.Infrastructure.Security;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Infrastructure
{
    public static class AddInfrastructureDI
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<ITokenGenerator, JwtTokenGenerator>();
            services.AddScoped<IPasswordHasher, BCryptPasswordHasher>();

            return services;
        }
    }
}
