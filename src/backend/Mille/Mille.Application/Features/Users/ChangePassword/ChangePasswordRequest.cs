using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Users.ChangePassword
{
    public class ChangePasswordRequest
    {
        public Guid UserId { get; set; }
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
