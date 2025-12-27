import React, { useState, useEffect, useRef } from 'react';
import CodeEditor from '../components/Editor/CodeEditor';
import LivePreview from '../components/Preview/LivePreview';
import useEditorStore from '../store/editorStore';
import { 
  PanelLeft, 
  PanelTop, 
  Settings, 
  Maximize2, 
  Minimize2, 
  Share2, 
  Save, 
  Cloud, 
  Sun, 
  Moon, 
  CheckCircle, 
  LayoutDashboard, 
  X,
  Heart
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import { motion, AnimatePresence } from 'framer-motion';
import penService from '../services/pen.service';
import EmbedModal from '../components/UI/EmbedModal';

const EditorPage = () => {
  const { html, css, js, setHtml, setCss, setJs, user, theme, setTheme, title, setTitle, activePenId, setActivePenId } = useEditorStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  // Layout State
  const [previewHeight, setPreviewHeight] = useState(50); // percentage
  const [isDraggingVertical, setIsDraggingVertical] = useState(false);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const containerRef = useRef(null);

  // Load pen if ID exists in URL
  useEffect(() => {
    if (id && id !== activePenId) {
      const loadPen = async () => {
        try {
          const pen = await penService.getPenById(id);
          setHtml(pen.html);
          setCss(pen.css);
          setJs(pen.js);
          setTitle(pen.title);
          setActivePenId(pen.id);
          setIsLiked(pen.likes > 0); // Simplified check
        } catch (err) {
          console.error("Failed to load pen", err);
        }
      };
      loadPen();
    }
  }, [id]);

  const handleLike = async () => {
    if (!user) { navigate('/login'); return; }
    if (!activePenId) { alert("Save your pen first!"); return; }
    
    try {
      await penService.likePen(activePenId);
      setIsLiked(true);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTheme = () => {
     setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSave = async () => {
    if (!user) {
      navigate('/signup');
      return;
    }

    setIsSaving(true);
    try {
      const response = await penService.savePen({
        id: activePenId,
        title,
        html,
        css,
        js
      });
      
      if (!activePenId) {
        setActivePenId(response.id);
        navigate(`/dashboard/${user.role || 'user'}/editor/${response.id}`);
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save pen", err);
      alert("Failed to save pen. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Drag Handlers
  const handleMouseDown = (e) => {
    setIsDraggingVertical(true);
    e.preventDefault(); // Prevent text selection
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingVertical) return;
      
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newHeight = ((containerRect.bottom - e.clientY) / containerRect.height) * 100;
        // Clamp between 10% and 90%
        setPreviewHeight(Math.min(Math.max(newHeight, 10), 90));
      }
    };

    const handleMouseUp = () => {
      setIsDraggingVertical(false);
    };

    if (isDraggingVertical) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingVertical]);

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#060606] text-slate-900 dark:text-white overflow-hidden transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#060606] border-b border-gray-200 dark:border-gray-800 z-20 shrink-0 h-16">
        <div className="flex items-center gap-4">
           <Link to="/" className="flex items-center gap-2 text-current no-underline group">
             <div className="w-8 h-8 bg-black dark:bg-white rounded flex items-center justify-center transition-transform group-hover:rotate-12">
              <div className="w-5 h-5 bg-white dark:bg-black rotate-45"></div>
            </div>
          </Link>
          <div className="flex flex-col">
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent text-sm font-bold focus:outline-none focus:ring-1 focus:ring-gray-500 rounded px-1 w-48"
              placeholder="Untitled Pen"
            />
             <span className="text-xs text-gray-500">{user ? user.username : 'Anonymous'}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <Link to={`/dashboard/${user?.role || 'user'}`}>
             <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2 border border-gray-200 dark:border-gray-700 hover:bg-slate-100 dark:hover:bg-white/5 text-gray-500 hover:text-black dark:hover:text-white">
               <LayoutDashboard size={16} />
               <span className="capitalize">Dashboard</span>
             </Button>
           </Link>

           <AnimatePresence>
             {saveSuccess && (
               <motion.span 
                 initial={{ opacity: 0, x: 10 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0 }}
                 className="text-xs text-green-500 flex items-center gap-1 font-medium"
               >
                 <CheckCircle size={14}/> Saved
               </motion.span>
             )}
           </AnimatePresence>

           <button 
             onClick={handleLike}
             className={`p-2 rounded-full transition-colors ${isLiked ? 'text-pink-500 bg-pink-50 dark:bg-pink-500/10' : 'text-gray-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
             title="Love this pen"
           >
             <Heart size={18} className={isLiked ? 'fill-current' : ''} />
           </button>

           <button 
             onClick={toggleTheme}
             className="p-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
             title="Toggle Theme"
           >
             {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
           </button>

          <Button 
            variant={saveSuccess ? "ghost" : "secondary"} 
            size="sm" 
            className="hidden sm:flex"
            onClick={handleSave}
            isLoading={isSaving}
          >
            <Cloud size={16} className="mr-2"/> Save
          </Button>

          {!user && (
            <Link to="/signup">
              <Button variant="primary" size="sm" className="hidden sm:flex">
                Sign Up
              </Button>
            </Link>
          )}

          <button className="p-2 bg-slate-100 dark:bg-[#2d2d2d] rounded-md hover:bg-slate-200 dark:hover:bg-[#363636] transition-colors">
            <Settings size={18} />
          </button>
           <div className="w-8 h-8 bg-gradient-to-tr from-green-400 to-blue-500 rounded overflow-hidden border border-gray-200 dark:border-gray-700">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'guest'}`} alt="avatar" />
           </div>
        </div>
      </header>

      {/* Resizable Main Content */}
      <div 
        ref={containerRef}
        className="flex-1 flex flex-col overflow-hidden relative"
      >
        {/* Editors Area (Top) */}
        <div style={{ height: `${100 - previewHeight}%` }} className="flex min-h-[10%]">
          <div className="flex-1 border-r border-gray-200 dark:border-gray-800">
            <CodeEditor
              title="HTML"
              language="html"
              value={html}
              onChange={setHtml}
              icon={<div className="w-3 h-3 bg-red-500 rounded-sm"></div>}
            />
          </div>
          <div className="flex-1 border-r border-gray-200 dark:border-gray-800">
            <CodeEditor
              title="CSS"
              language="css"
              value={css}
              onChange={setCss}
              icon={<div className="w-3 h-3 bg-blue-500 rounded-sm"></div>}
            />
          </div>
          <div className="flex-1">
            <CodeEditor
              title="JS"
              language="javascript"
              value={js}
              onChange={setJs}
              icon={<div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>}
            />
          </div>
        </div>

        {/* Resizer Handle */}
        <div 
          onMouseDown={handleMouseDown}
          className="h-2 bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 cursor-row-resize flex items-center justify-center transition-colors shrink-0 z-10"
        >
           <div className="w-8 h-1 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
        </div>

        {/* Preview Area (Bottom) */}
        <div style={{ height: `${previewHeight}%` }} className="min-h-[10%] bg-white relative">
           <LivePreview />
           
           {/* Overlay to catch events while dragging to prevent iframe capturing mouse */}
           {isDraggingVertical && <div className="absolute inset-0 z-50 bg-transparent"></div>}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="flex items-center justify-between px-4 py-1 bg-white dark:bg-[#060606] text-gray-500 text-xs border-t border-gray-200 dark:border-gray-800 z-20 shrink-0 h-8">
        <div className="flex items-center gap-4">
           <button className="hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors"><PanelLeft size={14}/> Console</button>
           <button className="hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors"><PanelTop size={14}/> Assets</button>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsFullscreenPreview(true)}
            className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1"
          >
            <Maximize2 size={14}/> Full Screen
          </button>
          <span>•</span>
          <button className="hover:text-black dark:hover:text-white transition-colors">Shortcuts</button>
          <span>•</span>
          <button 
            onClick={() => {
              if (!activePenId) {
                alert("Please save your pen first to generate an embed code.");
                return;
              }
              setIsEmbedModalOpen(true);
            }}
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            Embed
          </button>
        </div>
      </footer>

      {/* Modals */}
      <EmbedModal 
        isOpen={isEmbedModalOpen} 
        onClose={() => setIsEmbedModalOpen(false)} 
        penId={activePenId}
        title={title}
        user={user}
      />

      {/* Full Screen Preview Overlay */}
      <AnimatePresence>
        {isFullscreenPreview && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-white dark:bg-black flex flex-col"
          >
            {/* Overlay Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#060606]">
               <span className="font-bold text-lg">Full Screen Preview</span>
               <button 
                 onClick={() => setIsFullscreenPreview(false)}
                 className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors"
               >
                 <X size={24} />
               </button>
            </div>
            
            {/* Overlay Content */}
            <div className="flex-1 relative">
               <LivePreview />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EditorPage;