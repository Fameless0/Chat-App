import React from 'react';

export default function UserList({ type }) {
  const globalUsers = [
    { id: 1, name: 'Alice', location: 'USA' },
    { id: 2, name: 'Bob', location: 'UK' },
    { id: 3, name: 'Carlos', location: 'Spain' },
  ];

  const localUsers = [
    { id: 4, name: 'Dinesh', location: 'India' },
    { id: 5, name: 'Sneha', location: 'India' },
    { id: 6, name: 'Ravi', location: 'India' },
  ];

  const users = type === 'global' ? globalUsers : localUsers;

  return (
    <div className="text-white">
      <h3 className="text-lg font-semibold mb-2 capitalize">{type} Users</h3>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="bg-gray-700 px-3 py-2 rounded hover:bg-gray-600">
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-gray-300">{user.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
