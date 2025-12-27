import React from 'react';
import { Users, TrendingUp, DollarSign, Activity, Server, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminOverviewView = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black mb-2">System Overview</h1>
        <p className="text-slate-500 dark:text-gray-400">Real-time metrics and system performance.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Revenue" 
          value="$12,450" 
          change="+15%" 
          isPositive={true}
          icon={<DollarSign size={20} className="text-green-500"/>}
          color="green"
        />
        <MetricCard 
          title="Active Users" 
          value="1,234" 
          change="+8%" 
          isPositive={true}
          icon={<Users size={20} className="text-blue-500"/>}
          color="blue"
        />
        <MetricCard 
          title="New Signups" 
          value="45" 
          change="-2%" 
          isPositive={false}
          icon={<TrendingUp size={20} className="text-purple-500"/>}
          color="purple"
        />
        <MetricCard 
          title="Server Load" 
          value="24%" 
          change="Normal" 
          icon={<Activity size={20} className="text-orange-500"/>}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Traffic Overview</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-bold rounded-full">Weekly</span>
              <span className="px-3 py-1 text-gray-400 text-xs font-bold hover:text-gray-500 cursor-pointer">Monthly</span>
            </div>
          </div>
          
          {/* Simulated Chart */}
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 65, 30, 80, 55, 90, 45, 70, 50, 60, 75, 50].map((height, i) => (
              <div key={i} className="w-full bg-slate-100 dark:bg-white/5 rounded-t-sm relative group overflow-hidden">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                  className="absolute bottom-0 w-full bg-blue-500/50 group-hover:bg-blue-500 transition-colors"
                ></motion.div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        {/* System Health */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-bold text-lg mb-6">System Health</h3>
            
            <div className="space-y-6">
              <HealthItem label="Database Status" status="Operational" icon={<Database size={16}/>} color="green"/>
              <HealthItem label="API Server" status="Operational" icon={<Server size={16}/>} color="green"/>
              <HealthItem label="Storage" status="85% Used" icon={<Server size={16}/>} color="orange"/>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
             <h3 className="font-bold mb-2">Pro Subscription</h3>
             <p className="text-sm text-slate-400 mb-4">24 users subscribed this week.</p>
             <div className="text-3xl font-black">$2,400</div>
             <div className="text-xs text-green-400 font-bold">+12% vs last week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, change, isPositive, icon, color }) => (
  <div className="glass-card p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 bg-${color}-500/10 rounded-lg`}>{icon}</div>
      {change && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          isPositive === true ? 'bg-green-500/10 text-green-500' : 
          isPositive === false ? 'bg-red-500/10 text-red-500' : 'bg-slate-100 dark:bg-white/10 text-slate-500'
        }`}>
          {change}
        </span>
      )}
    </div>
    <div className="text-2xl font-black mb-1">{value}</div>
    <div className="text-sm text-gray-500">{title}</div>
  </div>
);

const HealthItem = ({ label, status, icon, color }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="text-gray-400">{icon}</div>
      <span className="font-medium text-sm">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full bg-${color}-500 animate-pulse`}></div>
      <span className={`text-xs font-bold text-${color}-500`}>{status}</span>
    </div>
  </div>
);

export default AdminOverviewView;
