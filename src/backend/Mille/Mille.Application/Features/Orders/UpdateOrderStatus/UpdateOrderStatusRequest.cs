using Mille.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Orders.UpdateOrderStatus
{
    public class UpdateOrderStatusRequest
    {
        public Guid OrderId { get; set; }
        public OrderStatus NewStatus { get; set; }
        public string? Note { get; set; }
    }
}
