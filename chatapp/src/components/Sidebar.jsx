export default function Sidebar({ users, selfId, onSelectUser }) {
  return (
    <div className="w-64 bg-gray-800 text-white p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Online Users</h2>
      <ul>
        {Object.entries(users).map(([id, name]) => (
          id !== selfId && (
            <li
              key={id}
              className="cursor-pointer hover:bg-gray-700 p-2 rounded"
              onClick={() => onSelectUser(id)}
            >
              {name}
            </li>
          )
        ))}
      </ul>
    </div>
  );
}