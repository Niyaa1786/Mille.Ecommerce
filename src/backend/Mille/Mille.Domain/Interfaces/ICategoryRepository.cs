using Mille.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Domain.Interfaces
{
    public interface ICategoryRepository : IBaseRepository<Category, int>
    {
        Task<Category?> GetByNameAsync(string name, CancellationToken ct = default);
        Task<IEnumerable<Category>> GetAllActiveAsync(CancellationToken ct = default);
    }
}
