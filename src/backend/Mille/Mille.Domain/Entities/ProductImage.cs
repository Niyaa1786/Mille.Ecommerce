using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Domain.Entities
{
    public class ProductImage
    {
        public int Id { get; private set; }
        public Guid ProductId { get; private set; }
        public Guid? ProductVariantId { get; private set; }
        public string ImageUrl { get; private set; } = string.Empty;
        public bool IsThumbnail { get; private set; }

        public Product? Product { get; private set; }

        private ProductImage() { }

        public ProductImage(Product product, string imageUrl, bool isThumbnail = false, Guid? variantId = null)
        {
            ProductId = product.Id;
            ImageUrl = imageUrl;
            IsThumbnail = isThumbnail;
            ProductVariantId = variantId;
        }

        public void SetThumbnail()
        {
            IsThumbnail = true;
        }


        public void ClearThumbnail()
        {
            IsThumbnail = false;
        }
    }
}
