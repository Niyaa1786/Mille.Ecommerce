using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Common.Interfaces
{
    public interface IFileUploadService
    {
        Task<string> UploadFileAsync(Stream fileStream, string fileName, string folder, string? publicId = null, bool overwrite = false, CancellationToken ct = default);
        Task<bool> DeleteFileAsync(string publicId, CancellationToken ct = default);

    }
}
