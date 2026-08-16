using Mille.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Common.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository Users { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
