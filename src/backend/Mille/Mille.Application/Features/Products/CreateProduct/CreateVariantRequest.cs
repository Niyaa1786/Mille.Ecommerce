using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Products.CreateProduct
{
    public class CreateVariantRequest
    {
        public string SKU { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string? Size { get; set; }
        public string? Color { get; set; }
    }
}
