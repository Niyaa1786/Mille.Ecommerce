using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Common.DTOs
{
    public class ProductImageDto
    {
        public int Id { get; set; }
        public string PublicId { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsThumbnail { get; set; }
    }
}
