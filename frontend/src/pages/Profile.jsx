import React, { useEffect, useState } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import useEditorStore from '../store/editorStore';
import penService from '../services/pen.service';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Code, 
  LayoutDashboard, 
  User, 
  Settings, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import Button from '../components/UI/Button';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useEditorStore();
  const [pens, setPens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchPens = async () => {
      try {
        const data = await penService.getUserPens();
        setPens(data);
      } catch (err) {
        console.error("Failed to fetch pens", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPens();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this pen?")) {
      try {
        await penService.deletePen(id);
        setPens(pens.filter(p => p.id !== id));
      } catch (err) {
        alert("Failed to delete pen");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#060606] text-slate-900 dark:text-white transition-colors duration-300">
      <Header />
      
      <div className="flex flex-1 pt-16">
        {/* Collapsible Sidebar */}
        <motion.aside 
          initial={{ width: 280 }}
          animate={{ width: isSidebarOpen ? 280 : 80 }}
          className="hidden md:flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#060606] h-[calc(100vh-64px)] fixed top-16 left-0 z-30 overflow-hidden"
        >
          <div className="flex-1 py-6 px-4 space-y-2">
             <SidebarItem 
               icon={<LayoutDashboard size={20} />} 
               label="Overview" 
               to={`/${user?.role}/dashboard`}
               isOpen={isSidebarOpen}
             />
             <SidebarItem 
               icon={<User size={20} />} 
               label="Profile" 
               to={`/${user?.role}/dashboard/profile`} 
               isOpen={isSidebarOpen}
               active
             />
             <SidebarItem 
               icon={<Code size={20} />} 
               label="New Pen" 
               to={`/${user?.role}/dashboard/editor`} 
               isOpen={isSidebarOpen}
             />
             
             {user?.role === 'admin' && (
               <>
                 <div className={`my-4 border-t border-gray-200 dark:border-gray-800 ${!isSidebarOpen && 'mx-2'}`}></div>
                 <SidebarItem 
                   icon={<ShieldCheck size={20} className="text-red-500" />} 
                   label="Admin Panel" 
                   to={`/${user?.role}/dashboard/admin`}
                   isOpen={isSidebarOpen}
                 />
               </>
             )}
             
             <div className={`my-4 border-t border-gray-200 dark:border-gray-800 ${!isSidebarOpen && 'mx-2'}`}></div>
             
             <SidebarItem 
               icon={<Settings size={20} />} 
               label="Settings" 
               to="#" 
               isOpen={isSidebarOpen}
             />
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

        {/* Main Content */}
        <main 
          className={`flex-1 p-6 md:p-12 transition-all duration-300 w-full ${isSidebarOpen ? 'md:ml-[280px]' : 'md:ml-[80px]'}`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-green-400 to-blue-500 p-1">
                   <div className="w-full h-full rounded-2xl bg-white dark:bg-[#1e1e1e] overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} alt="avatar" />
                   </div>
                </div>
                <div>
                  <h2 className="text-4xl font-black mb-1">{user?.username}</h2>
                  <p className="text-slate-500 dark:text-gray-400">Member since {new Date().getFullYear()}</p>
                </div>
              </div>
              
              <Link to={`/${user?.role}/dashboard/editor`}>
                <Button variant="primary">Create New Pen</Button>
              </Link>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-800 mb-8">
               <nav className="flex gap-8">
                  <button className="pb-4 border-b-2 border-green-500 font-bold text-sm uppercase tracking-wider">Your Pens ({pens.length})</button>
                  <button className="pb-4 border-b-2 border-transparent text-gray-500 hover:text-current font-bold text-sm uppercase tracking-wider">Collections</button>
                  <button className="pb-4 border-b-2 border-transparent text-gray-500 hover:text-current font-bold text-sm uppercase tracking-wider">Loved</button>
               </nav>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : pens.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                 <Code size={48} className="mx-auto mb-4 text-gray-400"/>
                 <h3 className="text-xl font-bold mb-2">No pens yet</h3>
                 <p className="text-gray-500 mb-6">Create your first pen to see it here!</p>
                 <Link to={`/${user?.role}/dashboard/editor`}>
                   <Button variant="secondary">Start Coding</Button>
                 </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pens.map((pen, index) => (
                  <motion.div 
                    key={pen.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group glass-card rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all"
                  >
                    <div className="h-48 bg-white dark:bg-white/5 relative overflow-hidden">
                       {/* Iframe Preview Placeholder */}
                       <div className="absolute inset-0 p-4 font-mono text-[10px] text-gray-400 overflow-hidden opacity-50">
                          {pen.html}
                       </div>
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <Link to={`/${user?.role}/dashboard/editor/${pen.id}`} className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-xl">
                            <Edit2 size={20}/>
                          </Link>
                          <button 
                            onClick={() => handleDelete(pen.id)}
                            className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-xl"
                          >
                            <Trash2 size={20}/>
                          </button>
                       </div>
                    </div>
                    <div className="p-5 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg mb-1 group-hover:text-green-500 transition-colors">{pen.title}</h3>
                        <p className="text-xs text-gray-500">Last updated {new Date(pen.updated_at).toLocaleDateString()}</p>
                      </div>
                      <Link to={`/${user?.role}/dashboard/editor/${pen.id}`} className="text-gray-400 hover:text-green-500 transition-colors">
                         <ExternalLink size={18}/>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

const SidebarItem = ({ icon, label, to, isOpen, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
      active 
        ? 'bg-slate-100 dark:bg-white/10 text-black dark:text-white font-bold' 
        : 'text-gray-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
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

export default Profile;