using Mille.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Domain.Interfaces
{
    public interface IProductImageRepository : IBaseRepository<ProductImage, int>
    {
        Task<IEnumerable<ProductImage>> GetByProductIdAsync(Guid productId, CancellationToken ct = default);
        Task<IEnumerable<ProductImage>> GetByVariantIdAsync(Guid variantId, CancellationToken ct = default);
    }
}
