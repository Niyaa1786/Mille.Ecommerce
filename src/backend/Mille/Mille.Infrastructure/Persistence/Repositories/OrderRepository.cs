using Microsoft.EntityFrameworkCore;
using Mille.Domain.Entities;
using Mille.Domain.Enums;
using Mille.Domain.Interfaces;
using Mille.Infrastructure.Persistence.Data;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Infrastructure.Persistence.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext _context;
        public OrderRepository(AppDbContext context) => _context = context;

        public async Task<IEnumerable<Order>> GetAllAsync(CancellationToken ct)
            => await _context.Orders.AsNoTracking().ToListAsync(ct);

        public async Task<Order?> GetByIdAsync(Guid id, CancellationToken ct)
            => await _context.Orders.FirstOrDefaultAsync(o => o.Id == id, ct);

        public async Task<Order?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct)
            => await _context.Orders
                .Include(o => o.Items)
                .Include(o => o.StatusHistories)
                .Include(o => o.User)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.Id == id, ct);

        public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(Guid userId, int page, int pageSize, CancellationToken ct)
            => await _context.Orders
                .AsNoTracking()
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(ct);

        public async Task<IEnumerable<Order>> GetOrdersAsync(int page, int pageSize, OrderStatus? status, CancellationToken ct)
        {
            var query = _context.Orders.AsNoTracking().AsQueryable();

            if (status.HasValue)
                query = query.Where(o => o.Status == status);

            return await query
                .OrderByDescending(o => o.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(ct);
        }

        public async Task<int> CountOrdersByUserIdAsync(Guid userId, CancellationToken ct)
            => await _context.Orders.CountAsync(o => o.UserId == userId, ct);

        public async Task<int> CountOrdersAsync(OrderStatus? status, CancellationToken ct)
        {
            var query = _context.Orders.AsQueryable();

            if (status.HasValue)
                query.Where(o => o.Status == status);

            return await query.CountAsync(ct);

        }

        public void Add(Order entity) => _context.Orders.Add(entity);
        public void Update(Order entity) => _context.Orders.Update(entity);
        public void Remove(Order entity) => _context.Orders.Remove(entity);

    }
}
