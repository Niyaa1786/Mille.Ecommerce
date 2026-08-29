using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Orders.GetOrder
{
    public class OrderStatusHistoryDto
    {
        public int Id { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Note { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
