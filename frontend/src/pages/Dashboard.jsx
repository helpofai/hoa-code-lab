import React, { useEffect, useState } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import useEditorStore from '../store/editorStore';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Code, 
  User, 
  Settings, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Plus,
  Bell,
  BarChart3,
  Layout
} from 'lucide-react';
import { motion } from 'framer-motion';

// Import Views
import OverviewView from '../components/Dashboard/OverviewView';
import ProfileView from '../components/Dashboard/ProfileView';
import AdminView from '../components/Dashboard/AdminView';
import MyPensView from '../components/Dashboard/MyPensView';
import AdminOverviewView from '../components/Dashboard/AdminOverviewView';
import AdminNotificationsView from '../components/Dashboard/AdminNotificationsView';
import UserInsightsView from '../components/Dashboard/UserInsightsView';
import AdminFrontendView from '../components/Dashboard/AdminFrontendView';

const Dashboard = () => {
  const { user } = useEditorStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Determine active view based on URL path
  const getActiveView = () => {
    const path = location.pathname.replace(/\/$/, ''); // Remove trailing slash
    
    if (path.includes('/settings/profile')) return <ProfileView />;
    if (path.includes('/pens')) return <MyPensView />;
    if (path.includes('/admin/users')) return <AdminView />;
    if (path.endsWith('/admin/overviews')) return <AdminOverviewView />;
    if (path.endsWith('/admin/notifications')) return <AdminNotificationsView />;
    if (path.endsWith('/admin/frontend')) return <AdminFrontendView />;
    return <OverviewView />;
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden">
      {/* Collapsible Sidebar */}
      <motion.aside 
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="hidden md:flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#020617] h-full fixed top-0 left-0 z-50 overflow-hidden"
      >
        {/* Sidebar Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
           <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black dark:bg-white rounded flex items-center justify-center shrink-0">
                <div className="w-5 h-5 bg-white dark:bg-black rotate-45"></div>
              </div>
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg font-black tracking-tight whitespace-nowrap"
                >
                  CodePen
                </motion.span>
              )}
           </Link>
        </div>

        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                        <SidebarItem 
                          icon={<LayoutDashboard size={20} />} 
                          label="Overview" 
                          to={`/dashboard/${user?.role || 'user'}`}
                          isOpen={isSidebarOpen}
                          active={isActive(`/dashboard/${user?.role || 'user'}`)}
                        />
                        <SidebarItem 
                          icon={<BarChart3 size={20} />} 
                          label="My Insights" 
                          to={`/dashboard/${user?.role || 'user'}/insights`} 
                          isOpen={isSidebarOpen}
                          active={isActive(`/dashboard/${user?.role || 'user'}/insights`)}
                        />
                        <SidebarItem 
                          icon={<Code size={20} />} 
                          label="My Pens" 
            
             to={`/dashboard/${user?.role || 'user'}/pens`} 
             isOpen={isSidebarOpen}
             active={isActive(`/dashboard/${user?.role || 'user'}/pens`)}
           />
           <SidebarItem 
             icon={<Plus size={20} />} 
             label="New Pen" 
             to={`/dashboard/${user?.role || 'user'}/editor`} 
             isOpen={isSidebarOpen}
           />
           
           {/* USER SETTINGS */}
           <div className={`my-4 border-t border-gray-200 dark:border-gray-800 ${!isSidebarOpen && 'mx-2'}`}></div>
           
           {isSidebarOpen && <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase">Settings</div>}
           
           <SidebarItem 
             icon={<User size={20} />} 
             label="Profile" 
             to={`/dashboard/${user?.role || 'user'}/settings/profile`} 
             isOpen={isSidebarOpen}
             active={isActive(`/dashboard/${user?.role || 'user'}/settings/profile`)}
           />
           
           <SidebarItem 
             icon={<Settings size={20} />} 
             label="General" 
             to="#" 
             isOpen={isSidebarOpen}
           />

           {/* ADMIN SECTION */}
           {user?.role === 'admin' && (
             <div className="mt-auto pb-4">
               <div className={`my-4 border-t border-gray-200 dark:border-gray-800 ${!isSidebarOpen && 'mx-2'}`}></div>
               {isSidebarOpen && <div className="px-4 py-2 text-xs font-bold text-red-500 uppercase tracking-widest">Admin Controls</div>}
               
               <SidebarItem 
                 icon={<LayoutDashboard size={20} className="text-red-500" />} 
                 label="System Overview" 
                 to={`/dashboard/${user?.role || 'user'}/admin/overviews`}
                 isOpen={isSidebarOpen}
                 active={isActive(`/dashboard/${user?.role || 'user'}/admin/overviews`)}
               />

                                <SidebarItem 

                                  icon={<ShieldCheck size={20} className="text-red-500" />} 

                                  label="User Management" 

                                  to={`/dashboard/${user?.role || 'user'}/admin/users`}

                                  isOpen={isSidebarOpen}

                                  active={isActive(`/dashboard/${user?.role || 'user'}/admin/users`)}

                                />

               

                                                 <SidebarItem 

               

                                                   icon={<Bell size={20} className="text-red-500" />} 

               

                                                   label="Broadcast Alerts" 

               

                                                   to={`/dashboard/${user?.role || 'user'}/admin/notifications`}

               

                                                   isOpen={isSidebarOpen}

               

                                                   active={isActive(`/dashboard/${user?.role || 'user'}/admin/notifications`)}

               

                                                 />

               

                                

               

                                                 <SidebarItem 

               

                                                   icon={<Layout size={20} className="text-red-500" />} 

               

                                                   label="Frontend Settings" 

               

                                                   to={`/dashboard/${user?.role || 'user'}/admin/frontend`}

               

                                                   isOpen={isSidebarOpen}

               

                                                   active={isActive(`/dashboard/${user?.role || 'user'}/admin/frontend`)}

               

                                                 />

               

                                               </div>

               

                                
           )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center justify-center w-full p-2 text-gray-500 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </motion.aside>

      {/* Main Container */}
      <div className={`flex flex-col flex-1 transition-all duration-300 h-full overflow-y-auto ${isSidebarOpen ? 'md:ml-[280px]' : 'md:ml-[80px]'}`}>
        <Header className={isSidebarOpen ? 'left-[280px]' : 'left-[80px]'} />
        
        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12 pt-32">
          <motion.div 
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-7xl mx-auto"
          >
             {getActiveView()}
          </motion.div>
        </main>

        <Footer className="px-12" />
      </div>
    </div>
  );
  
};

const SidebarItem = ({ icon, label, to, isOpen, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 ${
      active 
        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 font-bold' 
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
    }`}
    title={!isOpen ? label : ''}
  >
    <div className="min-w-[20px]">{icon}</div>
    {isOpen && (
      <motion.span 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="whitespace-nowrap"
      >
        {label}
      </motion.span>
    )}
  </Link>
);

export default Dashboard;