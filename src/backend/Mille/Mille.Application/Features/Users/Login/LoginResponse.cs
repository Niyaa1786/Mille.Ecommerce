using Mille.Application.Common.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Users.Login
{
    public class LoginResponse
    {
        public string AccessToken { get; set; } = string.Empty;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime AccessTokenExpiration { get; set; }
        public DateTime RefreshTokenExpiration { get; set; }
        public UserDto? User { get; set; }
    }
}
