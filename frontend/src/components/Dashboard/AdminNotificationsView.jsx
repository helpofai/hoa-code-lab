import React, { useState } from 'react';
import { Send, Bell, Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../UI/Button';
import notificationService from '../../services/notification.service';

const AdminNotificationsView = () => {
  const [formData, setFormData] = useState({ title: '', message: '', type: 'info' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await notificationService.sendGlobalNotification(formData);
      setSuccess(true);
      setFormData({ title: '', message: '', type: 'info' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black mb-2">System Notifications</h1>
        <p className="text-slate-500 dark:text-gray-400">Send global alerts to all registered users.</p>
      </div>

      <div className="glass-card p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Notification Title</label>
            <input 
              type="text" 
              placeholder="e.g., Scheduled Maintenance"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Message</label>
            <textarea 
              rows="4"
              placeholder="Enter your message here..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Alert Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
               <TypeOption 
                 type="info" 
                 current={formData.type} 
                 onClick={() => setFormData({...formData, type: 'info'})}
                 icon={<Info size={16}/>}
                 color="blue"
               />
               <TypeOption 
                 type="success" 
                 current={formData.type} 
                 onClick={() => setFormData({...formData, type: 'success'})}
                 icon={<CheckCircle size={16}/>}
                 color="green"
               />
               <TypeOption 
                 type="warning" 
                 current={formData.type} 
                 onClick={() => setFormData({...formData, type: 'warning'})}
                 icon={<AlertTriangle size={16}/>}
                 color="orange"
               />
               <TypeOption 
                 type="error" 
                 current={formData.type} 
                 onClick={() => setFormData({...formData, type: 'error'})}
                 icon={<AlertCircle size={16}/>}
                 color="red"
               />
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full py-4" 
              isLoading={loading}
              disabled={success}
            >
              {success ? "Notification Sent!" : "Broadcast Notification"} <Send size={18} className="ml-2"/>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TypeOption = ({ type, current, onClick, icon, color }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
      current === type 
        ? `border-${color}-500 bg-${color}-500/10 text-${color}-500 font-bold` 
        : 'border-gray-200 dark:border-gray-800 text-gray-500 hover:bg-slate-50 dark:hover:bg-white/5'
    }`}
  >
    {icon}
    <span className="text-[10px] mt-2 uppercase font-black tracking-widest">{type}</span>
  </button>
);

export default AdminNotificationsView;
