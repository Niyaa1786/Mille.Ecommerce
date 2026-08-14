using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Mille.Api.Responses;
using System.Net;
using System.Text.Json;

namespace Mille.Api.Handler
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
            int statusCode = (int)HttpStatusCode.InternalServerError;
            string message = "An unexpected error occurred.";
            object? errors = null;

            if(exception is ValidationException valEx)
            {
                statusCode = (int)HttpStatusCode.BadRequest;
                message = "Validation failed.";
                errors = valEx.Errors.GroupBy(e => e.PropertyName)
                    .ToDictionary(g => JsonNamingPolicy.CamelCase.ConvertName(g.Key), g => g.Select(e => e.ErrorMessage).ToArray());
            }
            else if(exception is UnauthorizedAccessException authEx)
            {
                statusCode = (int)HttpStatusCode.Unauthorized;
                message = "Unauthorized access";
            }

            var response = ApiResponse<object>.Failure(errors!, message);

            httpContext.Response.StatusCode = statusCode;
            await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);
            return true;
        }
    }
}
