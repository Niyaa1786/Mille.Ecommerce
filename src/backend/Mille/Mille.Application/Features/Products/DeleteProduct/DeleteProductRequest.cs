using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Mille.Application.Features.Products.DeleteProduct
{
    public class DeleteProductRequest
    {
        [JsonIgnore]
        public Guid Id { get; set; }
    }
}
