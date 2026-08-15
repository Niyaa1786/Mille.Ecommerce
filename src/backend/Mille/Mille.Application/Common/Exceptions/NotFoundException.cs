using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Application.Common.Exceptions
{
    public class NotFoundException : Exception
    {
        public NotFoundException(string message) : base(message) { }
        public NotFoundException(string name, object key) : base($"{name} with ID '{key}' was not found.") { }
    }
}
