using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Orders.GetOrder
{
    public class OrderItemDto
    {
        public int Id { get; set; }
        public Guid ProductVariantId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string SKU { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal => Quantity * UnitPrice;
    }
}
