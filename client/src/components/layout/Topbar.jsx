import { useState, useRef, useEffect } from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 bg-white dark:bg-[#111111] border-b border-[#E5E7EB] dark:border-[#2A2A2A] flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      <button
        onClick={onMenuClick}
        className="md:hidden text-[#6B7280] hover:text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC4899]/40 rounded-md p-1"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <div className="hidden md:block" />

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsDark((prev) => !prev)}
          aria-label="Toggle dark mode"
          className="p-2 rounded-lg text-[#6B7280] hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC4899]/40"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EC4899]/40 rounded-full"
          >
            <div className="w-9 h-9 rounded-full bg-[#EC4899] text-white flex items-center justify-center text-sm font-semibold">
              {initials}
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#202020] border border-[#E5E7EB] dark:border-[#2A2A2A] rounded-xl shadow-lg py-1 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-2 border-b border-[#E5E7EB] dark:border-[#2A2A2A]">
                <p className="text-sm font-medium text-[#111827] dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-[#6B7280] dark:text-[#BDBDBD] truncate">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-sm text-[#EF4444] hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] transition-colors duration-150"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
