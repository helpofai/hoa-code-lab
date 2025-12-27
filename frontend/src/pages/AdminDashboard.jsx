import React, { useEffect, useState } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import useEditorStore from '../store/editorStore';
import adminService from '../services/admin.service';
import { useNavigate } from 'react-router-dom';
import { Trash2, User, Shield, Users } from 'lucide-react';
import Button from '../components/UI/Button';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useEditorStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        const data = await adminService.getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, navigate]);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await adminService.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#060606] text-slate-900 dark:text-white transition-colors duration-300">
      <Header />
      
      <main className="flex-1 pt-24 pb-20 px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
            <Shield size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black">Admin Dashboard</h1>
            <p className="text-gray-500">Manage users and system settings</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="glass-card rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-slate-50 dark:bg-[#1e1e1e]">
               <h3 className="font-bold flex items-center gap-2">
                 <Users size={18}/> Registered Users ({users.length})
               </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 bg-slate-50/50 dark:bg-white/5">
                    <th className="px-6 py-3 font-semibold text-gray-500">ID</th>
                    <th className="px-6 py-3 font-semibold text-gray-500">User</th>
                    <th className="px-6 py-3 font-semibold text-gray-500">Email</th>
                    <th className="px-6 py-3 font-semibold text-gray-500">Role</th>
                    <th className="px-6 py-3 font-semibold text-gray-500">Joined</th>
                    <th className="px-6 py-3 font-semibold text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {users.map((u) => (
                    <motion.tr 
                      key={u.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-gray-400">#{u.id}</td>
                      <td className="px-6 py-4 font-bold flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-pink-500 p-[1px]">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} className="rounded-full bg-white" alt="avatar"/>
                         </div>
                         {u.username}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          u.role === 'admin' 
                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                            : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        {u.role !== 'admin' && (
                          <button 
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
