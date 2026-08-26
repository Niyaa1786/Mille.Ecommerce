using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Carts.GetCart
{
    public class GetCartResponse
    {
        public Guid CartId { get; set; }
        public List<CartItemDto> Items { get; set; } = new();
        public decimal TotalPrice { get; set; }
    }
}
