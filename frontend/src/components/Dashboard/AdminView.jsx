import React, { useEffect, useState } from 'react';
import { Trash2, Users, Shield, Edit, Plus, UserPlus, MoreVertical, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import adminService from '../../services/admin.service';
import useEditorStore from '../../store/editorStore';
import Button from '../UI/Button';
import Modal from '../UI/Modal';

const AdminView = () => {
  const { user } = useEditorStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({ username: '', email: '', role: 'user' });

  useEffect(() => {
    fetchUsers();
  }, [user]);

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

  const handleOpenAddModal = () => {
    setModalMode('add');
    setFormData({ username: '', email: '', role: 'user' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({ username: user.username, email: user.email, role: user.role });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement actual API calls for Add/Edit
    // For now, we'll simulate the update in the UI
    if (modalMode === 'add') {
       alert("Add User functionality requires backend implementation.");
    } else {
       setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u));
    }
    setIsModalOpen(false);
  };

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div></div>;
  if (user?.role !== 'admin') return <div>Unauthorized</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
            <Shield size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black">User Management</h1>
            <p className="text-gray-500">Manage access and permissions.</p>
          </div>
        </div>
        
        <Button variant="primary" onClick={handleOpenAddModal}>
          <UserPlus size={18} className="mr-2"/> Add User
        </Button>
      </div>

      <div className="glass-card rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-slate-50 dark:bg-[#1e1e1e]">
           <h3 className="font-bold flex items-center gap-2">
             <Users size={18}/> Registered Users ({users.length})
           </h3>
           <div className="flex gap-2">
             {/* Filter/Sort Placeholders */}
             <select className="bg-transparent text-sm font-medium text-gray-500 outline-none">
               <option>All Roles</option>
               <option>Admin</option>
               <option>User</option>
             </select>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-slate-50/50 dark:bg-white/5">
                <th className="px-6 py-3 font-semibold text-gray-500">User</th>
                <th className="px-6 py-3 font-semibold text-gray-500">Role</th>
                <th className="px-6 py-3 font-semibold text-gray-500">Status</th>
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
                  className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-pink-500 p-[1px]">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} className="rounded-full bg-white" alt="avatar"/>
                       </div>
                       <div>
                         <div className="font-bold text-slate-900 dark:text-white">{u.username}</div>
                         <div className="text-xs text-gray-500">{u.email}</div>
                       </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={u.role}
                      onChange={(e) => {
                         // Simulate role change immediately
                         setUsers(users.map(user => user.id === u.id ? { ...user, role: e.target.value } : user));
                      }}
                      className={`px-2 py-1 rounded-md text-xs font-bold uppercase border-none outline-none cursor-pointer ${
                        u.role === 'admin' 
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
                          : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      }`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-xs font-medium text-green-500">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div> Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenEditModal(u)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Edit size={16} />
                      </button>
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalMode === 'add' ? "Add New User" : "Edit User"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Username</label>
            <input 
              type="text" 
              className="w-full p-2 bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Email</label>
            <input 
              type="email" 
              className="w-full p-2 bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Role</label>
            <select 
              className="w-full p-2 bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">{modalMode === 'add' ? 'Create User' : 'Save Changes'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminView;