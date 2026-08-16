using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Mille.Application.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application
{
    public static class AddApplicationDI
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddValidatorsFromAssemblyContaining<IUnitOfWork>();

            services.Scan(scan =>
                scan.FromAssemblyOf<IUnitOfWork>()
                    .AddClasses(classes => classes.Where(c => c.Name.EndsWith("UseCase")), publicOnly: false)
                    .AsSelf()
                    .WithScopedLifetime());
            return services;
        }
    }
}
