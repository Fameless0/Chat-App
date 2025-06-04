import React from 'react';

export default function GroupList() {
  const groups = [
    { id: 1, name: 'Family Chat', members: 5 },
    { id: 2, name: 'Project Team', members: 8 },
    { id: 3, name: 'Gaming Buddies', members: 12 },
  ];

  return (
    <div className="text-white">
      <h3 className="text-lg font-semibold mb-2">Groups</h3>
      <ul className="space-y-2">
        {groups.map((group) => (
          <li key={group.id} className="bg-gray-700 px-3 py-2 rounded hover:bg-gray-600">
            <p className="font-medium">{group.name}</p>
            <p className="text-xs text-gray-300">{group.members} members</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
