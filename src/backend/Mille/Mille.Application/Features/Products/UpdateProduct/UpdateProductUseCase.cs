using FluentValidation;
using Microsoft.AspNetCore.Http.Features;
using Mille.Application.Common.DTOs;
using Mille.Application.Common.Exceptions;
using Mille.Application.Common.Interfaces;
using Mille.Application.Features.Products.CreateProduct;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Products.UpdateProduct
{
    public class UpdateProductUseCase : IUseCase<UpdateProductRequest, UpdateProductResponse>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFileUploadService _fileUploadService;
        private readonly IValidator<UpdateProductRequest> _validator;
        public UpdateProductUseCase(IUnitOfWork unitOfWork, IFileUploadService fileUploadService, IValidator<UpdateProductRequest> validator)
        {
            _unitOfWork = unitOfWork;
            _fileUploadService = fileUploadService;
            _validator = validator;
        }

        public async Task<UpdateProductResponse> ExecuteAsync(UpdateProductRequest request, CancellationToken ct = default)
        {
            _validator.ValidateAndThrow(request);

            var product = await _unitOfWork.Products.GetByIdAsync(request.Id, ct);
            if (product == null || product.IsDeleted)
                throw new NotFoundException(nameof(Products), request.Id);

            var category = await _unitOfWork.Categories.GetByIdAsync(request.CategoryId, ct);
            if (category == null || category.IsDeleted)
                throw new NotFoundException(nameof(Categories), request.CategoryId);

            var skus = request.Variants.Select(v => v.SKU).ToList();
            if(skus.Count() != skus.Distinct().Count())
                throw new AppValidationException(nameof(request.Variants), "Duplicate SKU in request.");

            foreach(var sku in skus)
            {
                var isSkuExist = await _unitOfWork.ProductVariants.IsExistBySkuAsync(sku, ct);
                if(isSkuExist)
                    throw new AppValidationException(nameof(CreateVariantRequest.SKU), $"SKU '{sku}' already exists.");
            }

            product.Update(request.Name, request.CategoryId, request.Description, request.Status);

            var oldVariant = product.Variants.ToList();
            foreach(var variant in oldVariant)
            {
                product.RemoveVariant(variant.Id);
            }
            foreach (var v in request.Variants)
            {
                product.AddVariant(v.SKU, v.Price, v.Stock, v.Size, v.Color);
            }

            var oldImage = product.Images.ToList();
            foreach(var image in oldImage)
            {
                product.RemoveImage(image.Id);
            }

            var uploadResults = await _fileUploadService.UploadFilesAsync(request.Images, "Product", ct);
            bool isFirst = true;
            foreach(var result in uploadResults)
            {
                product.AddImage(result.Url, result.PublicId, isFirst);
                isFirst = false;
            }

            var productImages = await _unitOfWork.ProductImages.GetByProductIdAsync(product.Id, ct);
            var idsList = productImages.Select(i => i.PublicId).ToList();
            var isSuccess = await _fileUploadService.DeleteFilesAsync(idsList, ct);
            if (isSuccess == false)
                throw new Exception($"Failed to delete images on Cloudinary for list: {idsList}.");

            await _unitOfWork.SaveChangesAsync(ct);

            return new UpdateProductResponse
            {
                Id = product.Id,
                CategoryId = product.CategoryId,
                Name = product.Name,
                Description = product.Description,
                Status = product.Status.ToString(),
                Variants = product.Variants.Select(v => new ProductVariantDto
                {
                    Id = v.Id,
                    SKU = v.SKU,
                    Price = v.Price,
                    Stock = v.Stock,
                    Size = v.Size,
                    Color = v.Color,
                    CreatedAt = v.CreatedAt,
                    UpdatedAt = v.UpdatedAt,
                }).ToList(),
                Images = product.Images.Select(i => new ProductImageDto
                {
                    Id = i.Id,
                    PublicId = i.PublicId,
                    ImageUrl = i.ImageUrl,
                    IsThumbnail = i.IsThumbnail

                }).ToList()
            };
        }
    }
}
