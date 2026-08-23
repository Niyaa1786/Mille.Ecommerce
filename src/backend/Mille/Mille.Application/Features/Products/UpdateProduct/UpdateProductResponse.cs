using Mille.Application.Common.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Products.UpdateProduct
{
    public  class UpdateProductResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string? Description { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<ProductVariantDto> Variants { get; set; } = new();
        public List<ProductImageDto> Images { get; set; } = new();
    }
}
