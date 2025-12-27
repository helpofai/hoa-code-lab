import React, { useState } from 'react';
import useEditorStore from '../../store/editorStore';
import { 
  User, 
  Mail, 
  MapPin, 
  Link as LinkIcon, 
  Twitter, 
  Github, 
  Save, 
  Camera,
  Lock,
  Trash2,
  Globe
} from 'lucide-react';
import Button from '../UI/Button';
import { motion } from 'framer-motion';

const ProfileView = () => {
  const { user } = useEditorStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black mb-2">Settings</h1>
        <p className="text-slate-500 dark:text-gray-400">Manage your profile details and account preferences.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
        {['profile', 'account', 'notifications'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-bold capitalize transition-colors border-b-2 ${
              activeTab === tab 
                ? 'border-blue-500 text-blue-500' 
                : 'border-transparent text-gray-500 hover:text-black dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Avatar Section */}
          <div className="glass-card p-8 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-[#1e1e1e] shadow-lg">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover bg-slate-100"
                />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors">
                <Camera size={16} />
              </button>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-xl font-bold mb-1">Profile Photo</h3>
              <p className="text-sm text-gray-500 mb-4">Recommended 300x300px. JPG, PNG or GIF.</p>
              <div className="flex gap-3 justify-center sm:justify-start">
                <Button variant="outline" size="sm">Change Photo</Button>
                <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">Remove</Button>
              </div>
            </div>
          </div>

          {/* Public Profile Form */}
          <div className="glass-card p-8 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-6">
            <h3 className="text-xl font-bold mb-6">Public Profile</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Display Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input 
                    type="text" 
                    defaultValue={user?.username}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                  <input 
                    type="text" 
                    placeholder="San Francisco, CA"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="col-span-full space-y-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Bio</label>
                <textarea 
                  rows="4"
                  placeholder="Tell us a little bit about yourself..."
                  className="w-full p-4 bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                ></textarea>
                <p className="text-xs text-gray-500 text-right">0/160</p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
               <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider">Social Links</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <Globe size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input type="text" placeholder="Website URL" className="w-full pl-10 py-2.5 bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-blue-500"/>
                  </div>
                  <div className="relative">
                    <Twitter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input type="text" placeholder="Twitter Username" className="w-full pl-10 py-2.5 bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-blue-500"/>
                  </div>
                  <div className="relative">
                    <Github size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input type="text" placeholder="GitHub Username" className="w-full pl-10 py-2.5 bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-blue-500"/>
                  </div>
               </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} isLoading={isLoading} size="lg">
                Save Changes
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'account' && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
           <div className="glass-card p-8 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-6">
              <h3 className="text-xl font-bold mb-6">Login Information</h3>
              <div className="grid gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Email Address</label>
                    <div className="flex gap-4">
                       <div className="relative flex-1">
                          <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                          <input 
                            type="email" 
                            defaultValue={user?.email}
                            disabled
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
                          />
                       </div>
                       <Button variant="outline">Change</Button>
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                    <div className="flex gap-4">
                       <div className="relative flex-1">
                          <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                          <input 
                            type="password" 
                            value="••••••••••••"
                            disabled
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
                          />
                       </div>
                       <Button variant="outline">Reset</Button>
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-8 rounded-2xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 space-y-6">
              <div>
                 <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                 <p className="text-sm text-red-600/70 dark:text-red-400/70">Once you delete your account, there is no going back. Please be certain.</p>
              </div>
              <div className="flex items-center justify-between">
                 <div className="text-sm font-medium text-red-600 dark:text-red-400">Delete this account</div>
                 <Button variant="danger" size="sm" className="bg-red-600 text-white hover:bg-red-700 border-none shadow-none">Delete Account</Button>
              </div>
           </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileView;