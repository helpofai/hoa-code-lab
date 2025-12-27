import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Clock, 
  TrendingUp, 
  MousePointer2, 
  Heart, 
  Share2,
  Calendar,
  Zap
} from 'lucide-react';
import useEditorStore from '../../store/editorStore';
import penService from '../../services/pen.service';

const UserInsightsView = () => {
  const { user } = useEditorStore();
  const [pens, setPens] = useState([]);
  const [stats, setStats] = useState({ views: 0, likes: 0, shares: 0, engagement: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await penService.getUserPens();
        const views = data.reduce((acc, pen) => acc + (pen.views || 0), 0);
        const likes = data.reduce((acc, pen) => acc + (pen.likes || 0), 0);
        const shares = data.reduce((acc, pen) => acc + (pen.shares || 0), 0);
        
        setPens(data.sort((a, b) => (b.views + b.likes*5) - (a.views + a.likes*5)).slice(0, 4));
        setStats({ views, likes, shares, engagement: views + likes*5 + shares*10 });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black mb-2">Project Insights</h1>
        <p className="text-slate-500 dark:text-gray-400">Deep dive into your coding activity and project engagement.</p>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InsightCard 
          icon={<MousePointer2 size={20} className="text-blue-500" />} 
          label="Total Views" 
          value={stats.views.toLocaleString()} 
          trend="+12.5%" 
          color="blue"
        />
        <InsightCard 
          icon={<Heart size={20} className="text-pink-500" />} 
          label="Total Likes" 
          value={stats.likes.toLocaleString()} 
          trend="+5.2%" 
          color="pink"
        />
        <InsightCard 
          icon={<Share2 size={20} className="text-purple-500" />} 
          label="Shares" 
          value={stats.shares.toLocaleString()} 
          trend="+22%" 
          color="purple"
        />
        <InsightCard 
          icon={<Zap size={20} className="text-yellow-500" />} 
          label="Engagement" 
          value={stats.engagement.toLocaleString()} 
          trend="Score" 
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart Area */}
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-xl">Coding Activity</h3>
              <p className="text-sm text-gray-500">Your pen creation frequency over the last 30 days.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-slate-100 dark:bg-white/5 p-1 rounded-lg">
               <button className="px-3 py-1.5 rounded-md hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all">Month</button>
               <button className="px-3 py-1.5 rounded-md bg-white dark:bg-slate-800 text-blue-500 shadow-sm transition-all">Week</button>
            </div>
          </div>
          
          {/* Simulated Activity Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-3 px-2">
            {[20, 45, 15, 60, 35, 85, 40, 55, 30, 70, 95, 50, 65, 25, 45].map((height, i) => (
              <div key={i} className="w-full bg-slate-100 dark:bg-white/5 rounded-t-lg relative group">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 1, delay: i * 0.03, ease: "easeOut" }}
                  className={`absolute bottom-0 w-full rounded-t-lg transition-colors ${i === 10 ? 'bg-blue-500' : 'bg-blue-500/30 group-hover:bg-blue-500/60'}`}
                ></motion.div>
                {/* Tooltip on hover */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                   {Math.floor(height / 10)} Pens
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest px-2">
            <span>Dec 12</span>
            <span>Dec 19</span>
            <span>Dec 26</span>
          </div>
        </div>

        {/* Sidebar: Top Pens */}
        <div className="space-y-8">
          <div className="glass-card p-6 rounded-3xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-green-500" /> Top Projects
            </h3>
            
            <div className="space-y-5">
               {pens.map(pen => (
                 <TopPenItem key={pen.id} title={pen.title} views={pen.views} likes={pen.likes} />
               ))}
            </div>

            <button className="w-full mt-8 py-3 text-sm font-bold text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all">
              View Detailed Analytics
            </button>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden relative">
             <div className="relative z-10">
                <h3 className="font-bold text-xl mb-2">Weekly Summary</h3>
                <p className="text-blue-100 text-sm mb-6">You created 12% more content than last week. Keep it up!</p>
                <div className="flex items-center gap-2">
                   <div className="p-2 bg-white/20 rounded-lg"><Clock size={16}/></div>
                   <span className="text-xs font-bold uppercase tracking-wider">14h 20m Coding Time</span>
                </div>
             </div>
             {/* Abstract background shape */}
             <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InsightCard = ({ icon, label, value, trend, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-card p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl shadow-slate-200/50 dark:shadow-none"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 bg-${color}-500/10 rounded-2xl text-${color}-500`}>{icon}</div>
      <div className={`text-[10px] font-black px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}>
        {trend}
      </div>
    </div>
    <div className="text-3xl font-black mb-1">{value}</div>
    <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">{label}</div>
  </motion.div>
);

const TopPenItem = ({ title, views, likes }) => (
  <div className="flex items-center justify-between group cursor-pointer">
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-500 transition-colors">{title}</h4>
      <div className="flex items-center gap-3 mt-1">
        <span className="text-[10px] text-gray-400 flex items-center gap-1"><MousePointer2 size={10}/> {views}</span>
        <span className="text-[10px] text-gray-400 flex items-center gap-1"><Heart size={10}/> {likes}</span>
      </div>
    </div>
    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
       <BarChart3 size={14} />
    </div>
  </div>
);

export default UserInsightsView;
