using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Users.UpdateProfile
{
    public class UpdateProfileRequest
    {
        public Guid UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? AvatarUrl { get; set; }
    }
}
