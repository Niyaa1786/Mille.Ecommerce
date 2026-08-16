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

        public UnitOfWork(AppDbContext context) => _context = context;

        public IUserRepository Users => _userRepository ??= new UserRepository(_context);

        public Task<int> SaveChangesAsync(CancellationToken ct = default) => _context.SaveChangesAsync(ct);
    }
}
