using Mille.Application.Common.DTOs;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Mille.Application.Features.Users.UpdateAddress
{
    public class UpdateAddressRequest : AddressDto
    {
        [JsonIgnore]
        public Guid UserId { get; set; }
    }
}
