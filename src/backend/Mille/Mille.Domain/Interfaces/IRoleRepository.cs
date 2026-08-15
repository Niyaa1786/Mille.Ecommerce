using Mille.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Domain.Interfaces
{
    public interface IRoleRepository : IBaseRepository<Role,int>
    {
        Task<Role?> GetByNameAsync(string name, CancellationToken cancellationToken = default);
    }
}
