using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Configuration;
using Mille.Application.Common.DTOs;
using Mille.Application.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Infrastructure.Services
{
    public class CloudinaryService : IFileUploadService
    {
        private readonly Cloudinary _cloudinary;
        public CloudinaryService(IConfiguration configuration)
        {

            var cloudinarySettings = configuration.GetSection("CloudinarySettings");
            var cloudName = cloudinarySettings["CloudName"];
            var apiKey = cloudinarySettings["ApiKey"];
            var apiSecret = cloudinarySettings["ApiSecret"];

            if(string.IsNullOrEmpty(cloudName) ||
               string.IsNullOrEmpty(apiKey) ||
               string.IsNullOrEmpty(apiSecret))
                throw new Exception("Cloudinary configuration is missing.");

            var account = new Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(account);

        }

        public async Task<FileUploadResult> UploadFileAsync(Stream fileStream, string fileName, string folder, string? publicId = null, bool overwrite = false, CancellationToken ct = default)
        {
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(fileName, fileStream),
                Folder = folder,
                PublicId = publicId,
                Overwrite = overwrite,
                Invalidate = overwrite
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams, ct);

            if (uploadResult.Error is not null)
                throw new Exception($"Cloudinary upload failed: {uploadResult.Error.Message}");

            return new FileUploadResult
            {
                PublicId = uploadResult.PublicId,
                Url = uploadResult.SecureUrl.ToString(),
            };
        }

        public async Task<bool> DeleteFileAsync(string publicId, CancellationToken ct = default)
        {
            if (string.IsNullOrEmpty(publicId))
                return false;

            var deletionParams = new DeletionParams(publicId);

            var deletionResult = await _cloudinary.DestroyAsync(deletionParams);

            return deletionResult.Result == "ok";
        }
    }
}
