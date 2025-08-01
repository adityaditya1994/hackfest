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

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, switchRole, logout, setUser } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '🏠', current: location.pathname === '/' },
    { name: 'Team', href: '/team', icon: '👥', current: location.pathname === '/team' },
    { name: 'Hiring', href: '/hiring', icon: '💼', current: location.pathname === '/hiring' },
    { name: 'Experience', href: '/experience', icon: '📊', current: location.pathname === '/experience' },
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
    <div>
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
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      ✕
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component for mobile */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-telekom-magenta to-primary-600 px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-telekom-magenta font-bold text-lg">🤖</span>
                      </div>
                      <h1 className="text-white text-xl font-bold">Jarvis Analytics</h1>
                    </div>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                to={item.href}
                                className={`
                                  group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors
                                  ${item.current
                                    ? 'bg-primary-700 text-white'
                                    : 'text-primary-100 hover:text-white hover:bg-primary-700'
                                  }
                                `}
                              >
                                <span className="text-lg">{item.icon}</span>
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
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
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-telekom-magenta to-primary-600 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-telekom-magenta font-bold text-xl">🤖</span>
              </div>
              <h1 className="text-white text-2xl font-bold">Jarvis Analytics</h1>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`
                          group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors
                          ${item.current
                            ? 'bg-primary-700 text-white shadow-md'
                            : 'text-primary-100 hover:text-white hover:bg-primary-700'
                          }
                        `}
                      >
                        <span className="text-lg">{item.icon}</span>
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            ☰
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-gray-200 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-telekom-magenta to-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {user.role === 'leader' ? '👔 Leader View' : user.role === 'hr' ? '👥 HR View' : '🎯 Manager View'}
                </div>
                {user.department && (
                  <div className="text-sm text-gray-600">
                    Department: <span className="font-medium text-telekom-magenta">{user.department}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                  <span className="sr-only">Open user menu</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-telekom-magenta to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div className="hidden lg:flex lg:items-center">
                      <span className="text-sm font-semibold leading-6 text-gray-900">{user.name}</span>
                      <span className="ml-2 text-gray-400">▼</span>
                    </div>
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
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <div className="px-2 py-2 text-sm text-gray-700">
                            Signed in as <strong>{user.name}</strong>
                          </div>
                        )}
                      </Menu.Item>
                    </div>
                    
                    {/* Role Switcher */}
                    <div className="px-1 py-1">
                      <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Switch Role
                      </div>
                      {(['leader', 'hr', 'manager'] as const).map((role) => (
                        <Menu.Item key={role}>
                          {({ active }) => (
                            <button
                              onClick={() => switchRole(role)}
                              className={`${
                                active ? 'bg-primary-500 text-white' : 'text-gray-900'
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm capitalize ${
                                user?.role === role ? 'bg-primary-100 text-primary-900 font-medium' : ''
                              }`}
                            >
                              {role === 'leader' && '👔'} 
                              {role === 'hr' && '👥'} 
                              {role === 'manager' && '🎯'} 
                              <span className="ml-2">{role}</span>
                              {user?.role === role && <span className="ml-auto text-xs">✓</span>}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </div>

                    {/* Department Switcher for Leaders */}
                    {user?.role === 'leader' && (
                      <div className="px-1 py-1">
                        <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Department
                        </div>
                        {(['OneAI', 'Commerce', 'OneMind'] as const).map((dept) => (
                          <Menu.Item key={dept}>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  if (user) {
                                    setUser({ ...user, department: dept });
                                  }
                                }}
                                className={`${
                                  active ? 'bg-primary-500 text-white' : 'text-gray-900'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm ${
                                  user?.department === dept ? 'bg-primary-100 text-primary-900 font-medium' : ''
                                }`}
                              >
                                <span className="ml-2">{dept}</span>
                                {user?.department === dept && <span className="ml-auto text-xs">✓</span>}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    )}
                    
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                          >
                            🚪 Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
} 