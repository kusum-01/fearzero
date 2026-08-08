import { NavLink } from 'react-router-dom';
import { Home, FileText, Brain, MessageSquare, Users, BarChart3, User } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: Home },
  { label: 'Resume', path: '/resume', icon: FileText },
  { label: 'Resume Analysis', path: '/resume/analysis', icon: Brain },
  { label: 'HR Interview', path: '/interview', icon: MessageSquare },
  { label: 'Group Discussion', path: '/gd', icon: Users },
  { label: 'Progress & Analytics', path: '/progress', icon: BarChart3 },
  { label: 'Profile', path: '/profile', icon: User },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity duration-200"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#FAFAFA] border-r border-[#E5E7EB] z-40
        transform transition-transform duration-200 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:z-auto`}
      >
        <div className="h-16 flex items-center px-6 border-b border-[#E5E7EB]">
          <span className="text-lg font-bold text-[#111827] tracking-tight">FearZero</span>
        </div>

        <nav className="p-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC4899]/40
                  ${isActive
                    ? 'bg-[#FFF7FA] text-[#EC4899]'
                    : 'text-[#6B7280] hover:bg-white hover:text-[#111827]'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#EC4899] rounded-r-full" />
                    )}
                    <Icon size={18} strokeWidth={2} />
                    {item.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
