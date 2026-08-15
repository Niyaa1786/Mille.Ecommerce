using Mille.Application.Common.DTOs;
using Mille.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Security.Principal;
using System.Text;

namespace Mille.Application.Common.Interfaces
{
    public interface ITokenGenerator
    {
        TokenResult GenerateToken(User user);
    }
}
