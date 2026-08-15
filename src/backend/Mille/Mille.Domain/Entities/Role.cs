using Mille.Domain.Exceptions;
using System;
using System.Collections.Generic;
using System.Text;

namespace Mille.Domain.Entities
{
    public class Role
    {
        public int Id { get; private set; }
        public string Name { get; private set; }
        public DateTime CreatedAt { get; private set; }

        private readonly List<User> _users = new();
        public IReadOnlyCollection<User> Users => _users.AsReadOnly();

        private Role() { }

        public Role(string name)
        {
            Name = name;
            CreatedAt = DateTime.UtcNow;
        }

        public void Rename(string newName)
        {
            Name = newName;
        }

    }
}
