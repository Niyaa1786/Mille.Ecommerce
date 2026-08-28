using Mille.Domain.Entities;
using Mille.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Domain.Interfaces
{
    public interface IOrderRepository : IBaseRepository<Order, Guid>
    {
        Task<IEnumerable<Order>> GetOrdersAsync(int page, int pageSize, OrderStatus? status, CancellationToken ct = default);
        Task<IEnumerable<Order>> GetOrdersByUserIdAsync(Guid userId, int page, int pageSize, CancellationToken ct = default);
        Task<Order?> GetByIdWithDetailsAsync(Guid id, CancellationToken ct = default);
        Task<int> CountOrdersAsync(OrderStatus? status, CancellationToken ct = default);
        Task<int> CountOrdersByUserIdAsync(Guid userId, CancellationToken ct = default);

    }
}
