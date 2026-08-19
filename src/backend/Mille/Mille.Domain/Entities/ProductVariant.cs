using Mille.Domain.Enums;
using Mille.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Domain.Entities
{
    public class ProductVariant
    {
        public Guid Id { get; private set; }
        public Guid ProductId { get; private set; }
        public string SKU { get; private set; } = string.Empty;
        public string? Size { get; private set; }
        public string? Color { get; private set; }
        public decimal Price { get; private set; }
        public int Stock { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }

        public Product? Product { get; private set; }

        private ProductVariant() { }

        public ProductVariant(Product product, string sku, decimal price, int stock, string? size = null, string? color = null)
        {
            if (product.Status == ProductStatus.Discontinued)
                throw new DomainException("Cannot add variant to a discontinued product.");

            Id = Guid.NewGuid();
            ProductId = product.Id;
            SKU = sku;
            Price = price;
            Stock = stock;
            Size = size;
            Color = color;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
        }

        public void Update(string sku, decimal price, int stock, string? size, string? color)
        {
            SKU = sku;
            Price = price;
            Stock = stock;
            Size = size;
            Color = color;
            UpdatedAt = DateTime.UtcNow;
        }

        public void AdjustStock(int quantity)
        {
            if (Stock + quantity < 0)
                throw new DomainException("Not enough stock.");

            Stock += quantity;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
