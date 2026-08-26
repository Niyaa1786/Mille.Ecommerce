using Microsoft.EntityFrameworkCore;
using Mille.Application.Common.Interfaces;
using Mille.Domain.Interfaces;
using Mille.Infrastructure.Persistence.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Infrastructure.Persistence.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        private IUserRepository _userRepository;
        private ICategoryRepository categoryRepository;
        private IProductRepository _productRepository;
        private IProductVariantRepository _productVariantRepository;
        private IProductImageRepository _productImageRepository;
        private ICartRepository _cartRepository;

        public UnitOfWork(AppDbContext context) => _context = context;
        public IUserRepository Users => _userRepository ??= new UserRepository(_context);

        public ICategoryRepository Categories => categoryRepository ??= new CategoryRepository(_context);

        public IProductRepository Products => _productRepository ??= new ProductRepository(_context);

        public IProductVariantRepository ProductVariants => _productVariantRepository ??= new ProductVariantRepository(_context);

        public IProductImageRepository ProductImages => _productImageRepository  ??= new ProductImageRepository(_context);

        public ICartRepository Carts => _cartRepository ??= new CartRepository(_context);

        public Task<int> SaveChangesAsync(CancellationToken ct = default) => _context.SaveChangesAsync(ct);
    }
}
