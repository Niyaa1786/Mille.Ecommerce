using FluentValidation;
using Microsoft.VisualBasic;
using Mille.Application.Common.Exceptions;
using Mille.Application.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Carts.RemoveCartItem
{
    public class RemoveCartItemUseCase : IUseCase<RemoveCartItemRequest, RemoveCartItemResponse>
    {
        private readonly IUnitOfWork _unitOfWork;

        public RemoveCartItemUseCase(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<RemoveCartItemResponse> ExecuteAsync(RemoveCartItemRequest request, CancellationToken ct = default)
        {
            var cart = await _unitOfWork.Carts.GetByUserIdWithDetailsAsync(request.UserId, ct);
            if (cart == null)
                throw new NotFoundException("Cart not found.");

            cart.RemoveItem(request.CartItemId);

            await _unitOfWork.SaveChangesAsync(ct);

            return new RemoveCartItemResponse();
        }
    }
}
