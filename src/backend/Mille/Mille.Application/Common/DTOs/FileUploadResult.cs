using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Common.DTOs
{
    public class FileUploadResult
    {
        public required string Url { get; set; }
        public required string PublicId { get; set; }
    }
}
