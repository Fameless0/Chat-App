import React, { useState } from 'react';
import { FaUserFriends, FaUsers, FaLayerGroup, FaTimes } from 'react-icons/fa';
import UserList from './UserList';
import GroupList from './GroupList';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [activeTab, setActiveTab] = useState('global'); // 'global' | 'local' | 'groups'
  const user = JSON.parse(localStorage.getItem('user'));

  const renderContent = () => {
    switch (activeTab) {
      case 'global':
        return <UserList type="global" />;
      case 'local':
        return <UserList type="local" />;
      case 'groups':
        return <GroupList />;
      default:
        return null;
    }
  };

  return (
    <div className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out flex bg-gray-900 text-white ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Left Icon Nav */}
      <div className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
        <button onClick={toggleSidebar} className="text-white mb-4">
          <FaTimes />
        </button>

        <div className="space-y-4">
          <IconButton
            icon={<FaUserFriends />}
            label="Global Users"
            onClick={() => setActiveTab('global')}
            active={activeTab === 'global'}
          />
          <IconButton
            icon={<FaUsers />}
            label="Local Users"
            onClick={() => setActiveTab('local')}
            active={activeTab === 'local'}
          />
          <IconButton
            icon={<FaLayerGroup />}
            label="Groups"
            onClick={() => setActiveTab('groups')}
            active={activeTab === 'groups'}
          />
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="w-48 bg-gray-800 flex flex-col justify-between relative">
        <div className="p-4 overflow-y-auto">{renderContent()}</div>

        <div className="p-4 border-t border-gray-700 flex flex-col items-center">
          <p className="text-sm font-semibold truncate">{user?.username || 'Guest'}</p>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              window.location.reload();
            }}
            className="mt-2 text-sm bg-red-500 px-3 py-1 rounded hover:bg-red-600 w-full text-center"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const IconButton = ({ icon, label, onClick, active }) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className={`text-xl p-2 rounded hover:bg-gray-700 ${active ? 'bg-gray-700' : ''}`}
    >
      {icon}
    </button>
    <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 scale-0 group-hover:scale-100 transition-transform origin-left whitespace-nowrap bg-black px-2 py-1 text-xs rounded shadow-lg">
      {label}
    </span>
  </div>
);

export default Sidebar;
