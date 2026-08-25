using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Auth.DeleteAddress
{
    public class DeleteAddressValidator : AbstractValidator<DeleteAddressRequest>
    {
        public DeleteAddressValidator()
        {
            RuleFor(x => x.AddressId)
                .GreaterThan(0).WithMessage("Address ID must be valid.");
        }
    }
}
