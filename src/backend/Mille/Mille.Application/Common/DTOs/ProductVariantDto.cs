using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Common.DTOs
{
    public class ProductVariantDto
    {
        public Guid Id { get; set; }
        public string SKU { get; set; } = string.Empty;
        public string? Size { get; set; }
        public string? Color { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
