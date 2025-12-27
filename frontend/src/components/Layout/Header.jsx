import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useEditorStore from '../../store/editorStore';
import { Sun, Moon, User, LogOut, LayoutDashboard, Search, Bell, HelpCircle } from 'lucide-react';
import Button from '../UI/Button';
import NotificationCenter from './NotificationCenter';
import notificationService from '../../services/notification.service';

const Header = ({ className }) => {
  const { user, logout, theme, setTheme, addToast } = useEditorStore();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastNotifId, setLastNotifId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Check every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      const unread = data.filter(n => !n.is_read);
      setUnreadCount(unread.length);

      // If there's a new unread notification that we haven't toasted yet
      if (unread.length > 0 && unread[0].id !== lastNotifId) {
        const newest = unread[0];
        addToast({
          title: newest.title,
          message: newest.message,
          type: newest.type,
          actionLabel: 'View All',
          onAction: () => setIsNotifOpen(true)
        });
        setLastNotifId(newest.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className={`fixed top-0 right-0 z-40 bg-white/80 dark:bg-[#060606]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all duration-300 h-16 ${className || 'left-0'}`}>
      <div className="flex items-center justify-between h-full px-8">
        
        {/* Left Side: Search (or space if no sidebar) */}
        <div className="flex-1 max-w-xl">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search pens, users, projects..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900 rounded-xl outline-none transition-all text-sm"
              />
           </div>
        </div>

        {/* Right Side: Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
           <button className="p-2 text-gray-500 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors hidden sm:block">
             <HelpCircle size={20} />
           </button>
           
           <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 text-gray-500 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-[#060606] text-[8px] flex items-center justify-center text-white font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
           </div>

           <button 
             onClick={toggleTheme}
             className="p-2 text-gray-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors"
           >
             {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
           </button>

           <div className="h-8 w-[1px] bg-gray-200 dark:border-gray-800 mx-2 hidden sm:block"></div>

           <Link to={user ? `/dashboard/${user.role || 'user'}/editor` : "/editor"} className="hidden lg:block">
             <Button variant="primary" size="sm">New Pen</Button>
           </Link>
            
            {user && (
              <div className="flex items-center gap-3 ml-2 group cursor-pointer relative">
                 <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 p-[2px] shadow-lg">
                    <div className="w-full h-full rounded-full bg-white dark:bg-[#1e1e1e] overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} alt="avatar" />
                    </div>
                 </div>
                 
                 {/* Dropdown Menu (Hidden by default, show on hover or click) */}
                 <div className="absolute right-0 top-full mt-2 w-48 glass-card border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 mb-2">
                       <p className="text-sm font-bold truncate">{user.username}</p>
                       <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <Link to={`/dashboard/${user.role}/settings/profile`} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                       <User size={16}/> Profile
                    </Link>
                    <Link to={`/dashboard/${user.role}`} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                       <LayoutDashboard size={16}/> Dashboard
                    </Link>
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                       <LogOut size={16}/> Log Out
                    </button>
                 </div>
              </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;