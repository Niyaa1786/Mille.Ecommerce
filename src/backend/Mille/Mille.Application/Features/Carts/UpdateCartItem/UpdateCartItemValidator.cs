using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Carts.UpdateCartItem
{
    public class UpdateCartItemValidator : AbstractValidator<UpdateCartItemRequest>
    {
        public UpdateCartItemValidator()
        {
            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Quantity must be greater than 0");
        }
    }
}
