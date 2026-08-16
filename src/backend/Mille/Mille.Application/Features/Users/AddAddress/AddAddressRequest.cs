using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Features.Users.AddAddress
{
    public class AddAddressRequest
    {
        public Guid UserId { get; set; }
        public string ReceiverName { get; set; } = string.Empty;
        public string ReceiverPhone { get; set; } = string.Empty;
        public string AddressLine { get; set; } = string.Empty;
        public bool IsDefault { get; set; }
    }
}
