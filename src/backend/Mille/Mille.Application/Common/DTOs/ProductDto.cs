using Mille.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Common.DTOs
{
    public class ProductDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public ProductStatus Status { get; set; }
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public List<ProductVariantDto> Variants { get; set; } = new();
        public List<ProductImageDto> Images { get; set; } = new();

    }
}
