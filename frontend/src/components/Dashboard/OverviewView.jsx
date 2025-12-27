import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code, 
  Users, 
  Eye, 
  TrendingUp, 
  ChevronRight, 
  Plus, 
  ShieldCheck, 
  LayoutDashboard,
  User as UserIcon,
  Activity
} from 'lucide-react';
import Button from '../UI/Button';
import { motion } from 'framer-motion';
import penService from '../../services/pen.service';
import adminService from '../../services/admin.service';
import useEditorStore from '../../store/editorStore';

const OverviewView = () => {
  const { user } = useEditorStore();
  const [stats, setStats] = useState({ pens: 0, users: 0 });
  const [recentPens, setRecentPens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pens = await penService.getUserPens();
        setRecentPens(pens.slice(0, 3));
        
        const totalViews = pens.reduce((acc, pen) => acc + (pen.views || 0), 0);
        const totalLikes = pens.reduce((acc, pen) => acc + (pen.likes || 0), 0);
        const totalShares = pens.reduce((acc, pen) => acc + (pen.shares || 0), 0);
        
        // Custom Engagement Score: (Likes*5 + Views + Shares*10)
        const engagementScore = (totalLikes * 5) + totalViews + (totalShares * 10);
        
        let userCount = 0;
        if (user?.role === 'admin') {
           const allUsers = await adminService.getAllUsers();
           userCount = allUsers.length;
        }

        setStats({
          pens: pens.length,
          users: userCount,
          views: totalViews,
          engagement: engagementScore
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-black mb-2"
        >
          Dashboard Hub
        </motion.h1>
        <p className="text-slate-500 dark:text-gray-400">
          Manage your personal projects and system settings.
        </p>
      </div>

      {/* USER SECTION CONTAINER */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
           <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <UserIcon size={20} />
           </div>
           <h2 className="text-2xl font-bold">User Section</h2>
        </div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <StatCard 
            icon={<Code className="text-blue-500" />} 
            label="My Pens" 
            value={stats.pens} 
            color="blue"
          />
          <StatCard 
            icon={<Eye className="text-green-500" />} 
            label="Pen Views" 
            value={stats.views} 
            color="green"
          />
          <StatCard 
            icon={<TrendingUp className="text-purple-500" />} 
            label="Engagement" 
            value={stats.engagement.toLocaleString()} 
            color="purple"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-slate-50 dark:bg-white/5">
                <h3 className="font-bold flex items-center gap-2"><Activity size={18}/> Recent Activity</h3>
                <Link to={`/dashboard/${user?.role}/pens`} className="text-sm text-green-500 hover:underline">View all pens</Link>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                              {recentPens.length > 0 ? recentPens.map((pen) => (
                                <Link key={pen.id} to={`/dashboard/${user?.role}/editor/${pen.id}`} className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden relative">
                                        <iframe 
                                           srcDoc={`<html><head><style>${pen.css} body{margin:0; overflow:hidden; zoom:0.25;}</style></head><body>${pen.html}</body></html>`}
                                           className="w-full h-full pointer-events-none border-none"
                                           tabIndex="-1"
                                        />
                                    </div>
                                                          <div>
                                                            <h4 className="font-bold">{pen.title}</h4>
                                                            <div className="flex items-center gap-3 mt-1">
                                                               <p className="text-xs text-gray-500">Updated {new Date(pen.updated_at).toLocaleDateString()}</p>
                                                               <span className="text-[10px] text-gray-400 flex items-center gap-1 font-bold"><Eye size={10}/> {pen.views || 0}</span>
                                                            </div>
                                                          </div>
                                    
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </Link>
                )) : (
                  <div className="p-12 text-center text-gray-500">No pens created yet.</div>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-6">
             <div className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
                <h3 className="font-bold mb-4">Personal Actions</h3>
                <div className="grid gap-3">
                  <Link to={`/dashboard/${user?.role}/editor`}>
                    <Button variant="primary" className="w-full justify-start">
                      <Plus size={18} className="mr-2" /> New Pen
                    </Button>
                  </Link>
                  <Link to={`/dashboard/${user?.role}/settings/profile`}>
                    <Button variant="ghost" className="w-full justify-start border border-gray-200 dark:border-gray-800">
                      <LayoutDashboard size={18} className="mr-2" /> My Profile
                    </Button>
                  </Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* ADMIN SECTION CONTAINER */}
      {user?.role === 'admin' && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-8 border-t border-gray-200 dark:border-gray-800 space-y-6"
        >
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                <ShieldCheck size={20} />
             </div>
             <h2 className="text-2xl font-bold">Admin Section</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
              icon={<Users className="text-red-500" />} 
              label="System Users" 
              value={stats.users} 
              color="red"
            />
            <StatCard 
              icon={<ShieldCheck className="text-orange-500" />} 
              label="Server Status" 
              value="Healthy" 
              color="orange"
            />
             <StatCard 
              icon={<Activity className="text-yellow-500" />} 
              label="System Logs" 
              value="0 Errors" 
              color="yellow"
            />
          </div>

          <div className="glass-card p-8 rounded-2xl border border-dashed border-red-500/30 bg-red-500/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
               <h3 className="text-xl font-bold mb-2 text-red-600 dark:text-red-400">Administrative Controls</h3>
               <p className="text-slate-600 dark:text-gray-400">Access the full user management system and system configuration.</p>
            </div>
            <Link to={`/dashboard/${user?.role}/admin/users`}>
              <Button variant="danger" size="lg">
                Open Admin Panel <ChevronRight size={20} className="ml-2"/>
              </Button>
            </Link>
          </div>
        </motion.section>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-none"
  >
    <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <div className="text-2xl font-black mb-1">{value}</div>
    <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{label}</div>
  </motion.div>
);

export default OverviewView;