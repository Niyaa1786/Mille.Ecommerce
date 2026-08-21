using Mille.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Common.DTOs
{
    public class ProductListDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public ProductStatus Status { get; set; }
        public string? CategoryName { get; set; }
        public decimal MinPrice { get; set; }
        public string? ThumbnailUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
