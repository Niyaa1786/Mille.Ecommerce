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
        Task<bool> IsExistByName(string name, CancellationToken ct = default);
        Task<int> CountAsync(bool includeDeleted = false, CancellationToken ct = default);

        Task<IEnumerable<Category>> GetCategoriesAsync(
            string? keyword = null,
            bool includeDeleted = false,
            int page = 1,
            int pageSize = 10,
            CancellationToken ct = default);
    }
}
