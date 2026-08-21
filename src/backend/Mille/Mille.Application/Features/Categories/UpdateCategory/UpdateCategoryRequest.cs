using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Categories.UpdateCategory
{
    public class UpdateCategoryRequest
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
