using Mille.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Domain.Interfaces
{
    public interface IPaymentRepository : IBaseRepository<Payment, Guid>
    {
        Task<Payment?> GetByOrderIdAsync(Guid orderId, CancellationToken ct = default);
    }
}
