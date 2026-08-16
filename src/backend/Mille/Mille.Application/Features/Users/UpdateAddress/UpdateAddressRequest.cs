using Mille.Application.Common.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Users.UpdateAddress
{
    public class UpdateAddressRequest : AddressDto
    {
        public Guid UserId { get; set; }
    }
}
