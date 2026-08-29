using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Orders.GetOrder
{
    public class GetOrderResponse
    {
        public Guid Id { get; set; }
        public string ReceiverName { get; set; } = string.Empty;
        public string ReceiverPhone { get; set; } = string.Empty;
        public string ShippingAddress { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public decimal DiscountAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
        public List<OrderStatusHistoryDto> StatusHistories { get; set; } = new();
        public PaymentDto? Payment { get; set; }
    }
}
