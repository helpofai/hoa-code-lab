import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, ExternalLink, Code, Plus, Search, MoreHorizontal, Eye, Heart, Share2, AlertCircle } from 'lucide-react';
import Button from '../UI/Button';
import { motion } from 'framer-motion';
import penService from '../../services/pen.service';
import useEditorStore from '../../store/editorStore';

const MyPensView = () => {
  const { user } = useEditorStore();
  const [pens, setPens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPens = async () => {
      try {
        const data = await penService.getUserPens();
        setPens(data);
      } catch (err) {
        console.error("Failed to fetch pens", err);
        setError("Could not load projects. Please ensure database is synced.");
      } finally {
        setLoading(false);
      }
    };

    fetchPens();
  }, [user]);

  const handleLike = async (id) => {
    try {
      await penService.likePen(id);
      setPens(pens.map(p => p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async (id) => {
    try {
      await penService.sharePen(id);
      setPens(pens.map(p => p.id === id ? { ...p, shares: (p.shares || 0) + 1 } : p));
      alert("Share count updated! Link ready to share.");
    } catch (err) {
      console.error(err);
    }
  };

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

  const filteredPens = pens.filter(pen => 
    pen.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  if (error) return (
    <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-2xl border-2 border-dashed border-red-200 dark:border-red-900/30">
       <AlertCircle size={48} className="mx-auto mb-4 text-red-500"/>
       <h3 className="text-xl font-bold mb-2 text-red-600 dark:text-red-400">{error}</h3>
       <p className="text-gray-500 mb-6">Try running 'npm run db:sync' in the backend terminal.</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black mb-2">My Pens</h1>
          <p className="text-slate-500 dark:text-gray-400">Manage and edit your saved code snippets.</p>
        </div>
        <div className="flex gap-3">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
              <input 
                type="text" 
                placeholder="Search pens..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-black border focus:border-blue-500 rounded-lg outline-none transition-all text-sm w-full sm:w-64"
              />
           </div>
           <Link to={`/dashboard/${user?.role}/editor`}>
             <Button variant="primary">
               <Plus size={18} className="mr-2" /> Create New
             </Button>
           </Link>
        </div>
      </div>

      {filteredPens.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
           <Code size={48} className="mx-auto mb-4 text-gray-400"/>
           <h3 className="text-xl font-bold mb-2">No pens yet</h3>
           <p className="text-gray-500 mb-6">Create your first pen to see it here!</p>
           <Link to={`/dashboard/${user?.role}/editor`}>
             <Button variant="secondary">Start Coding</Button>
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPens.map((pen, index) => {
            const cleanHtml = pen?.html ? pen.html.replace(/<script\b[^>]*src=["'](?!(http|https|\/\/))[^"']*["'][^>]*><\/script>/gim, "") : "";
            
            return (
              <motion.div 
                key={pen.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className="group glass-card rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl dark:hover:shadow-blue-500/10 transition-all flex flex-col"
              >
                <div className="h-48 bg-white relative overflow-hidden pointer-events-none border-b border-gray-100 dark:border-gray-800">
                   <div className="absolute top-0 left-0" style={{ width: '1280px', height: '800px', transform: 'scale(0.25)', transformOrigin: '0 0' }}>
                      <iframe 
                        srcDoc={`<html><head><style>* { box-sizing: border-box; } body { margin: 0; padding: 0; font-family: sans-serif; overflow: hidden; width: 1280px; height: 800px; background: white; } ${pen.css || ''}</style></head><body>${cleanHtml}</body></html>`}
                        title={pen.title}
                        className="w-full h-full border-none"
                        tabIndex="-1"
                        scrolling="no"
                      />
                   </div>
                   <div className="absolute inset-0 bg-transparent group-hover:bg-black/[0.02] transition-colors"></div>
                   <div className="absolute top-3 left-3 flex gap-1">
                      <div className="px-1.5 py-0.5 bg-black/20 dark:bg-white/10 backdrop-blur-sm rounded text-[10px] font-bold text-white uppercase tracking-wider">HTML</div>
                      <div className="px-1.5 py-0.5 bg-black/20 dark:bg-white/10 backdrop-blur-sm rounded text-[10px] font-bold text-white uppercase tracking-wider">CSS</div>
                   </div>
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                      <Link to={`/dashboard/${user?.role}/editor/${pen.id}`}>
                        <button className="p-2 bg-black/70 text-white rounded-lg hover:bg-black transition-colors backdrop-blur-sm">
                          <Edit2 size={16}/>
                        </button>
                      </Link>
                   </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate mb-2" title={pen.title}>{pen.title}</h3>
                  <div className="flex items-center gap-2 mb-4">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`} alt="user" className="w-5 h-5 rounded-full bg-slate-100" />
                     <span className="text-xs text-gray-500 font-medium">{user?.username}</span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                    {pen.html ? pen.html.replace(/<[^>]*>?/gm, '').substring(0, 80) + (pen.html.length > 80 ? '...' : '') : 'No visual description available.'}
                  </p>
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between mt-auto">
                     <div className="flex gap-2">
                        <Link to={`/dashboard/${user?.role}/editor/${pen.id}`}>
                          <button className="px-2 py-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-1.5">
                            <Eye size={16}/><span className="text-xs font-bold">{pen.views || 0}</span>
                          </button>
                        </Link>
                        <button onClick={() => handleLike(pen.id)} className="px-2 py-1 text-gray-500 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-lg transition-colors flex items-center gap-1.5">
                            <Heart size={16} className={pen.likes > 0 ? 'fill-pink-500 text-pink-500' : ''}/><span className="text-xs font-bold">{pen.likes || 0}</span>
                        </button>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => handleShare(pen.id)} className="p-2 text-gray-400 hover:text-purple-500 rounded-lg transition-colors"><Share2 size={18}/></button>
                        <button onClick={() => handleDelete(pen.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"><Trash2 size={18}/></button>
                        <button className="p-2 text-gray-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"><MoreHorizontal size={18}/></button>
                     </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyPensView;