import { Fragment, useState } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  HomeIcon,
  UsersIcon,
  BriefcaseIcon,
  ChartBarIcon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { ChatbotWidget } from '../../../../chatbot/frontend';
import { classNames } from '../../utils/classNames';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const location = useLocation();
  const { user, switchRole, logout, setUser } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '🏠', current: location.pathname === '/' },
    { name: 'Team', href: '/team', icon: '👥', current: location.pathname === '/team' },
    { name: 'Hiring', href: '/hiring', icon: '💼', current: location.pathname === '/hiring' },
    { name: 'Experience', href: '/experience', icon: '📊', current: location.pathname === '/experience' },
  ];

  const bottomNavigation = [
    { name: 'Help', href: '/help', icon: '❓', current: location.pathname === '/help' },
    { name: 'Settings', href: '/settings', icon: '⚙️', current: location.pathname === '/settings' },
  ];

  const roles = [
    { 
      id: 'hr' as UserRole, 
      name: 'HR', 
      description: 'Company-wide analytics',
      icon: '👥',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    { 
      id: 'leader' as UserRole, 
      name: 'Leader', 
      description: 'Team & department insights',
      icon: '🎯',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    { 
      id: 'manager' as UserRole, 
      name: 'Manager', 
      description: 'Direct reports view',
      icon: '👨‍💼',
      color: 'bg-green-50 text-green-700 border-green-200'
    }
  ];

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar backdrop (mobile) */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <span className="h-6 w-6 text-white" aria-hidden="true">×</span>
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                  <div className="flex h-16 shrink-0 items-center">
                    <span className="text-primary-600 font-bold text-xl">Jarvis Analytics</span>
                  </div>
                  {/* Navigation content same as desktop */}
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                to={item.href}
                                className={classNames(
                                  location.pathname === item.href
                                    ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50',
                                  'group flex gap-x-3 rounded-l-md p-3 text-sm leading-6 font-medium nav-item'
                                )}
                              >
                                <span className="text-lg" aria-hidden="true">
                                  {item.icon}
                                </span>
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      
                      {/* Bottom Navigation */}
                      <li className="mt-auto">
                        <div className="border-t border-gray-200 pt-4">
                          <ul role="list" className="-mx-2 space-y-1">
                            {bottomNavigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  to={item.href}
                                  className={classNames(
                                    location.pathname === item.href
                                      ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50',
                                    'group flex gap-x-3 rounded-l-md p-3 text-sm leading-6 font-medium nav-item'
                                  )}
                                >
                                  <span className="text-lg" aria-hidden="true">
                                    {item.icon}
                                  </span>
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'
      }`}>
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="flex h-16 shrink-0 items-center justify-between">
            {!sidebarCollapsed && (
              <span className="text-primary-600 font-bold text-xl">Jarvis Analytics</span>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={sidebarCollapsed ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"} 
                />
              </svg>
            </button>
          </div>
          <nav className="flex-1">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        title={sidebarCollapsed ? item.name : undefined}
                        className={classNames(
                          location.pathname === item.href
                            ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                            : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50',
                          'group flex gap-x-3 rounded-l-md p-3 text-sm leading-6 font-medium nav-item',
                          sidebarCollapsed ? 'justify-center' : ''
                        )}
                      >
                        <span className="text-lg" aria-hidden="true">
                          {item.icon}
                        </span>
                        {!sidebarCollapsed && item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              
              {/* Bottom Navigation */}
              <li className="mt-auto">
                <div className="border-t border-gray-200 pt-4">
                  <ul role="list" className="-mx-2 space-y-1">
                    {bottomNavigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          title={sidebarCollapsed ? item.name : undefined}
                          className={classNames(
                            location.pathname === item.href
                              ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                              : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50',
                            'group flex gap-x-3 rounded-l-md p-3 text-sm leading-6 font-medium nav-item',
                            sidebarCollapsed ? 'justify-center' : ''
                          )}
                        >
                          <span className="text-lg" aria-hidden="true">
                            {item.icon}
                          </span>
                          {!sidebarCollapsed && item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
      }`}>
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-6 shadow-sm sm:gap-x-8 sm:px-8 lg:px-10">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-6 self-stretch lg:gap-x-8">
            <div className="relative flex flex-1 items-center">
              <span className="text-gray-600 text-sm">
                Welcome back, <span className="font-medium">{user?.name || 'User'}</span>
              </span>
            </div>
            <div className="flex items-center gap-x-6 lg:gap-x-8">
              {/* Enhanced Role Switcher */}
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center gap-x-3 px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:border-primary-300 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center gap-x-2">
                    <span className="text-lg">
                      {roles.find(role => role.id === user?.role)?.icon || '👤'}
                    </span>
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">
                        {roles.find(role => role.id === user?.role)?.name || 'Select Role'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {roles.find(role => role.id === user?.role)?.description || 'Choose your view'}
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm">▼</span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-150"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-20 mt-2 w-72 origin-top-right rounded-2xl bg-white py-2 shadow-xl ring-1 ring-gray-900/10 border border-gray-100 focus:outline-none">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Switch View
                      </p>
                    </div>
                    {roles.map((role) => (
                      <Menu.Item key={role.id}>
                        {({ active }) => (
                          <button
                            onClick={() => switchRole(role.id)}
                            className={classNames(
                              active ? 'bg-gray-50' : '',
                              'group flex w-full items-center justify-between px-4 py-3 text-sm transition-colors duration-150'
                            )}
                          >
                            <div className="flex items-center gap-x-3">
                              <div className={classNames(
                                'flex h-10 w-10 items-center justify-center rounded-xl border',
                                role.color
                              )}>
                                <span className="text-lg">{role.icon}</span>
                              </div>
                              <div className="text-left">
                                <div className="font-semibold text-gray-900">
                                  {role.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {role.description}
                                </div>
                              </div>
                            </div>
                            {user?.role === role.id && (
                              <span className="text-primary-600 font-bold">✓</span>
                            )}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block w-full text-left px-4 py-2 text-sm text-gray-700'
                          )}
                        >
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="py-8">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Chatbot Widget */}
      <ChatbotWidget position="bottom-right" />
    </div>
  );
} 