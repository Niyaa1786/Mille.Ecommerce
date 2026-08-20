using Mille.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Domain.Interfaces
{
    public interface IProductVariantRepository : IBaseRepository<ProductVariant, Guid>
    {
        Task<ProductVariant?> GetBySKUAsync(string sku, CancellationToken ct = default);
        Task<IEnumerable<ProductVariant>> GetByProductIdAsync(Guid productId, CancellationToken ct = default);
    }
}
