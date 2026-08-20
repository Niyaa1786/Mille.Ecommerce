using Microsoft.EntityFrameworkCore;
using Mille.Domain.Entities;
using Mille.Domain.Interfaces;
using Mille.Infrastructure.Persistence.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Infrastructure.Persistence.Repositories
{
    public class ProductVariantRepository : IProductVariantRepository
    {
        private readonly AppDbContext _context;
        public ProductVariantRepository(AppDbContext context) => _context = context;

        public async Task<IEnumerable<ProductVariant>> GetAllAsync(CancellationToken ct)
            => await _context.ProductVariants.AsNoTracking().ToListAsync(ct);

        public async Task<ProductVariant?> GetByIdAsync(Guid id, CancellationToken ct)
            => await _context.ProductVariants.FindAsync(id, ct);

        public async Task<ProductVariant?> GetBySKUAsync(string sku, CancellationToken ct)
            => await _context.ProductVariants.FirstOrDefaultAsync(v => v.SKU == sku, ct);

        public async Task<IEnumerable<ProductVariant>> GetByProductIdAsync(Guid productId, CancellationToken ct)
            => await _context.ProductVariants
                .Where(v => v.ProductId == productId)
                .ToListAsync(ct);

        public void Add(ProductVariant entity) => _context.ProductVariants.Add(entity);
        public void Update(ProductVariant entity) => _context.ProductVariants.Update(entity);
        public void Remove(ProductVariant entity) => _context.ProductVariants.Remove(entity);
    }
}
