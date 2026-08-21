using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Categories.CreateCategory
{
    public class CreateCategoryRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
