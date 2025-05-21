import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Menu,
  X,
  Home,
  Users,
  CheckSquare,
  Book,
  Pill,
  FileText,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { path: '/dashboard', icon: <Home size={20} />, text: 'Главная' },
    { path: '/patients', icon: <Users size={20} />, text: 'Пациенты' },
    { path: '/tasks', icon: <CheckSquare size={20} />, text: 'Задачи' },
    { path: '/journal', icon: <Book size={20} />, text: 'Журнал наблюдений' },
    { path: '/drugs', icon: <Pill size={20} />, text: 'Лекарства' },
    { path: '/medical_data', icon: <FileText size={20} />, text: 'Медицинские данные' },
    { path: '/notifications', icon: <Bell size={20} />, text: 'Уведомления' },
    { path: '/settings', icon: <Settings size={20} />, text: 'Настройки' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
      {/* Mobile header */}
      <header className="bg-white border-b border-neutral-200 py-4 px-6 md:hidden flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="p-1 rounded-md text-neutral-700 hover:bg-neutral-100">
          <Menu size={24} />
        </button>
        <h1 className="font-semibold text-lg text-primary-700">
          Медицинское сопровождение
        </h1>
      </header>
      
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-neutral-200 fixed md:sticky top-0 h-full md:h-screen z-10 transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${isExpanded ? 'w-64' : 'w-16 md:w-16'}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="flex flex-col h-full">
          {/* Mobile sidebar header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-neutral-200">
            <h1 className="font-semibold text-lg text-primary-700">
              Медицинское сопровождение
            </h1>
            <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-md text-neutral-700 hover:bg-neutral-100">
              <X size={24} />
            </button>
          </div>

          {/* Desktop sidebar header */}
          <div className="hidden md:flex items-center justify-center p-4 border-b border-neutral-200">
            {isExpanded ? (
              <h1 className="font-semibold text-xl text-primary-700 transition-opacity duration-300">
                Медицинское сопровождение
              </h1>
            ) : (
              <ChevronRight size={24} className="text-primary-700" />
            )}
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 py-6 px-2 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2.5 rounded-md transition-colors whitespace-nowrap ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    <span className={`ml-3 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 md:hidden'}`}>
                      {item.text}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* User panel */}
          <div className="p-2 border-t border-neutral-200">
            <div className={`flex items-center px-3 py-3 rounded-md ${isExpanded ? 'justify-between' : 'justify-center'}`}>
              <div className={`flex items-center ${isExpanded ? '' : 'justify-center'}`}>
                <div className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                {isExpanded && (
                  <div className="ml-3 min-w-0">
                    <p className="text-sm font-medium text-neutral-800 truncate">
                      {user?.email}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      Врач
                    </p>
                  </div>
                )}
              </div>
              {isExpanded && (
                <button
                  onClick={handleSignOut}
                  className="p-1 rounded-full text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
                  title="Выйти"
                >
                  <LogOut size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-x-hidden p-4 md:p-8 pt-4">
        <Outlet />
      </main>
      
      {/* Sidebar backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[5] md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashboardLayout;