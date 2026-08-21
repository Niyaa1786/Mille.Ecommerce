using Microsoft.EntityFrameworkCore;
using Mille.Domain.Entities;
using Mille.Domain.Interfaces;
using Mille.Infrastructure.Persistence.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Infrastructure.Persistence.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly AppDbContext _context;
        public CategoryRepository(AppDbContext context) => _context = context;

        public async Task<IEnumerable<Category>> GetAllAsync(CancellationToken ct)
            => await _context.Categories
                .AsNoTracking()
                .Where(c => !c.IsDeleted)
                .ToListAsync(ct);

        public async Task<IEnumerable<Category>> GetAllActiveAsync(CancellationToken ct)
            => await _context.Categories
                .AsNoTracking()
                .Where(c => !c.IsDeleted)
                .ToListAsync(ct);

        public async Task<Category?> GetByIdAsync(int id, CancellationToken ct)
            => await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == id && !c.IsDeleted, ct);

        public async Task<Category?> GetByNameAsync(string name, CancellationToken ct)
            => await _context.Categories
                .FirstOrDefaultAsync(c => c.Name == name && !c.IsDeleted, ct);

        public async Task<bool> IsExistByName(string name, CancellationToken ct)
            => await _context.Categories.AnyAsync(c => c.Name == name, ct);

        public void Add(Category entity) => _context.Categories.Add(entity);
        public void Update(Category entity) => _context.Categories.Update(entity);
        public void Remove(Category entity) => _context.Categories.Remove(entity);
    }
}
