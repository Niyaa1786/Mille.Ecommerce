
using FluentValidation;
using FluentValidation.Results;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Common.Exceptions
{
    public class AppValidationException : FluentValidation.ValidationException
    {
        public AppValidationException(string propertyName, string errorMessage) : base(new[] { new ValidationFailure(propertyName, errorMessage) }) { }
    }
}
