using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Users.RefreshToken
{
    public class RefreshTokenValidator : AbstractValidator<RefreshTokenRequest>
    {
        public RefreshTokenValidator()
        {
            RuleFor(x => x.RefreshToken)
                .NotEmpty().WithMessage("Refresh token is required.");
        }
    }
}
