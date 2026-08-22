using Microsoft.AspNetCore.Http;
using Mille.Application.Common.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Common.Interfaces
{
    public interface IFileUploadService
    {
        Task<FileUploadResult> UploadFileAsync(Stream fileStream, string fileName, string folder, string? publicId = null, bool overwrite = false, CancellationToken ct = default);
        Task<IEnumerable<FileUploadResult>> UploadFilesAsync(IEnumerable<IFormFile> files, string folder, CancellationToken ct = default);

        Task<bool> DeleteFileAsync(string publicId, CancellationToken ct = default);

    }
}
