using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Common.Interfaces
{
    public interface IUseCase<TRequest, TResponse>
    {
        Task<TResponse> ExecuteAsync(TRequest request, CancellationToken ct = default);
    }
}
