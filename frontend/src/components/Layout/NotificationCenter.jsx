import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Info, AlertTriangle, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import notificationService from '../../services/notification.service';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-500" size={18}/>;
      case 'warning': return <AlertTriangle className="text-orange-500" size={18}/>;
      case 'error': return <AlertCircle className="text-red-500" size={18}/>;
      default: return <Info className="text-blue-500" size={18}/>;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose}></div>
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#0f172a] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-slate-50/50 dark:bg-white/5">
               <h3 className="font-bold flex items-center gap-2">
                 Notifications {unreadCount > 0 && <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] rounded-full">{unreadCount}</span>}
               </h3>
               <div className="flex gap-2">
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-500 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                  <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg">
                    <X size={16}/>
                  </button>
               </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
               {loading ? (
                 <div className="p-12 text-center text-gray-400">Loading...</div>
               ) : notifications.length === 0 ? (
                 <div className="p-12 text-center">
                    <Bell size={32} className="mx-auto mb-3 text-gray-300"/>
                    <p className="text-sm text-gray-500">No notifications yet.</p>
                 </div>
               ) : (
                 <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors relative group ${!n.is_read ? 'bg-blue-50/30 dark:bg-blue-500/5' : ''}`}
                      >
                        <div className="flex gap-3">
                           <div className="mt-1">{getIcon(n.type)}</div>
                           <div className="flex-1">
                              <h4 className={`text-sm font-bold ${!n.is_read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-gray-400'}`}>
                                {n.title}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-gray-500 mt-1 leading-relaxed">
                                {n.message}
                              </p>
                              <span className="text-[10px] text-gray-400 mt-2 block">
                                {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                              </span>
                           </div>
                           {!n.is_read && (
                             <button 
                               onClick={() => handleMarkAsRead(n.id)}
                               className="opacity-0 group-hover:opacity-100 p-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded shadow-sm hover:text-blue-500 transition-all"
                               title="Mark as read"
                             >
                               <Check size={14}/>
                             </button>
                           )}
                        </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
            
            <div className="p-3 bg-slate-50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800 text-center">
               <button className="text-xs text-gray-500 hover:text-current font-bold uppercase tracking-widest">View History</button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;
