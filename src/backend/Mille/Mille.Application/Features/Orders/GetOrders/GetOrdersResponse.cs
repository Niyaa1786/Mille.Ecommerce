using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Orders.GetOrders
{
    public class GetOrdersResponse
    {
        public List<OrderSummaryDto> Orders { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)System.Math.Ceiling((double)TotalCount / PageSize);
    }
}
