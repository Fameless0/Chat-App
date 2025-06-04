import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-bold">Menu</h2>
        <button onClick={toggleSidebar}>
          <FaTimes />
        </button>
      </div>

      <nav className="flex flex-col p-4 space-y-2">
        <a href="#" className="hover:bg-gray-700 p-2 rounded">Chat</a>
        <a href="#" className="hover:bg-gray-700 p-2 rounded">Contacts</a>
        <a href="#" className="hover:bg-gray-700 p-2 rounded">Settings</a>
      </nav>

      <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-700 flex flex-col items-center justify-center">
        <p className="text-sm font-semibold truncate">{user?.username || 'Guest'}</p>
        <button
          onClick={() => {
            localStorage.removeItem('user');
            window.location.reload();
          }}
          className="mt-2 text-sm bg-red-500 px-3 py-1 rounded hover:bg-red-600 w-1/2 text-center"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
