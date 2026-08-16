using Mille.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Domain.Interfaces
{
    public interface IUserRepository : IBaseRepository<User, Guid>
    {
        Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
        Task<User?> GetByRefreshTokenAsync(string refreshToken, CancellationToken ct = default);
    }
}
