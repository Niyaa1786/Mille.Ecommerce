using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Orders.GetOrder
{
    public class PaymentDto
    {
        public Guid Id { get; set; }
        public string Method { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string? TransactionId { get; set; }
        public string? GatewayResponse { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? PaidAt { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
