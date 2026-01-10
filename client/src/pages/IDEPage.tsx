import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CodeEditor } from "../components/CodeEditor";
import { FileTree } from "../components/FileTree";
import { Preview } from "../components/Preview";
import { Terminal } from "../components/Terminal";
import { VSCodeLayout } from "../components/ide/VSCodeLayout";
import { useSocket } from "../hooks/useSocket";
import { useWebContainerStore } from "../store/useWebContainerStore";
import { useCodeStore } from "../store/useCodeStore";
import { useTerminalStore } from "../store/useTerminalStore";
import { cn } from "../lib/utils";
import { api } from "../lib/api";
import { 
    Save, 
    Loader2, 
    LayoutGrid, 
    Play, 
    Globe, 
    ExternalLink, 
    Plus, 
    X, 
    Code2, 
    Terminal as TerminalIcon, 
    Layers,
    Check,
    RefreshCcw 
} from "lucide-react";

function MenuButton({ icon: Icon, label, onClick, shortcut, className }: any) {
    return (
        <button 
            onClick={onClick}
            className={cn(
                "w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#cccccc] hover:bg-[#007fd4] hover:text-white transition-colors group",
                className
            )}
        >
            <div className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
            </div>
            {shortcut && <span className="text-[#71717a] group-hover:text-white/70 ml-4">{shortcut}</span>}
        </button>
    );
}

export function IDEPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("id");
  const { files, setFiles, setActiveProject, activeProject } = useCodeStore();
  const { init, mount, spawnShell, isReady, snapshot } = useWebContainerStore();
  const { write } = useTerminalStore();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(!!projectId);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  
  const shellProcessRef = useRef<any>(null);
  const terminalWriterRef = useRef<WritableStreamDefaultWriter | null>(null);

  useSocket();

  useEffect(() => {
    init();
    if (projectId) {
        loadProject();
    }
  }, [projectId]);

  useEffect(() => {
    if (isReady && !isPageLoading) {
        startShell();
    }
    return () => {
        terminalWriterRef.current?.releaseLock();
        shellProcessRef.current?.kill();
    };
  }, [isReady, isPageLoading]);

  const loadProject = async () => {
    try {
        const res = await api.get(`/api/projects/${projectId}`);
        setActiveProject(res.data);
        if (res.data.files) {
            try {
                const parsedFiles = JSON.parse(res.data.files);
                setFiles(parsedFiles);
            } catch (e) {
                console.error("Failed to parse files", e);
                setFiles({});
            }
        }
    } catch (err) {
        console.error("Failed to load project", err);
    } finally {
        setIsPageLoading(false);
    }
  };

  const startShell = async () => {
      if (shellProcessRef.current) return;
      try {
          await mount(files);
          const shell = await spawnShell((data) => write(data));
          shellProcessRef.current = shell;
          terminalWriterRef.current = shell.input.getWriter();
          
          const wc = useWebContainerStore.getState().instance;
          wc?.on('server-ready', (_, url) => {
              setPreviewUrl(url);
              write(`\r\n\x1b[1;35m[HOA] Server ready at ${url}\x1b[0m\r\n`);
          });
      } catch (err) {
          console.error("Failed to start shell", err);
      }
  };

  const handleTerminalData = (data: string) => {
      terminalWriterRef.current?.write(data);
  };

  const handleRun = async () => {
    if (!isReady || !terminalWriterRef.current) return;
    terminalWriterRef.current.write('npm install && npm start\n');
  };

  const handleRestart = async () => {
      if (!isReady) return;
      write("\r\n\x1b[1;33m[HOA] Restarting environment...\x1b[0m\r\n");
      setPreviewUrl(null);
      if (shellProcessRef.current) {
          shellProcessRef.current.kill();
          shellProcessRef.current = null;
      }
      await startShell();
  };

  const saveProject = async () => {
    if (!projectId) return;
    setIsSaving(true);
    setIsSaveSuccess(false);
    try {
        let updatedFiles = { ...files };
        if (isReady) {
            const fsSnapshot = await snapshot();
            Object.entries(fsSnapshot).forEach(([path, item]) => {
                if (!updatedFiles[path]) updatedFiles[path] = item;
            });
            Object.keys(updatedFiles).forEach(path => {
                if (!fsSnapshot[path]) delete updatedFiles[path];
            });
            setFiles(updatedFiles);
        }

        const persistentFiles: Record<string, any> = {};
        Object.entries(updatedFiles).forEach(([path, file]) => {
            if (!path.startsWith('node_modules/') && path !== 'node_modules') {
                persistentFiles[path] = file;
            }
        });

        await api.put(`/api/projects/${projectId}`, {
            files: JSON.stringify(persistentFiles)
        });

        setIsSaveSuccess(true);
        setTimeout(() => setIsSaveSuccess(false), 3000);
    } catch (err: any) {
        console.error("Failed to save project", err);
        const errorMsg = err.response?.data?.error || err.message || "Unknown error";
        alert(`Failed to save project: ${errorMsg}`);
    } finally {
        setIsSaving(false);
    }
  };

  if (isPageLoading) {
      return (
          <div className="h-screen w-full bg-[#1e1e1e] flex items-center justify-center text-white">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
      );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
        {/* IDE Top Bar */}
        <div className="h-9 bg-[#1e1e1e] border-b border-[#2b2b2b] flex items-center justify-between px-2 shrink-0 z-50">
            <div className="flex items-center gap-1">
                <Link to="/dashboard" className="p-1 hover:bg-white/5 rounded text-[#71717a] hover:text-white" title="Dashboard">
                    <LayoutGrid className="w-4 h-4" />
                </Link>
                <div className="relative">
                    <button onClick={() => setIsFileMenuOpen(!isFileMenuOpen)} className={cn("px-3 py-1 text-xs font-medium rounded hover:bg-white/5 transition-colors", isFileMenuOpen ? "bg-white/10 text-white" : "text-[#969696]")}>
                        File
                    </button>
                    <AnimatePresence>
                        {isFileMenuOpen && (
                            <>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40" onClick={() => setIsFileMenuOpen(false)} />
                                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute left-0 mt-1 w-48 bg-[#252526] border border-[#454545] rounded-md shadow-2xl py-1 z-50">
                                    <MenuButton icon={Plus} label="New Project..." onClick={() => navigate("/dashboard/newproject")} />
                                    <div className="h-[1px] bg-[#454545] my-1 mx-1" />
                                    <MenuButton icon={Save} label="Save Project" shortcut="Ctrl+S" onClick={() => { saveProject(); setIsFileMenuOpen(false); }} />
                                    <div className="h-[1px] bg-[#454545] my-1 mx-1" />
                                    <MenuButton icon={LayoutGrid} label="Go to Dashboard" onClick={() => navigate("/dashboard")} />
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
                <div className="text-xs text-[#969696] font-medium flex items-center gap-2 ml-2">
                    <span className="text-blue-400 font-bold opacity-50">/</span>
                    <span className="text-white">{activeProject?.name || "Sandbox"}</span>
                </div>
            </div>

            {previewUrl && (
                <div className="flex items-center gap-2 bg-black/40 border border-white/5 px-3 py-1 rounded text-[11px] font-mono text-neutral-400">
                    <Globe className="w-3 h-3 text-green-500" />
                    <span className="truncate max-w-[200px]">{previewUrl}</span>
                    <a href={previewUrl} target="_blank" rel="noreferrer" className="hover:text-white"><ExternalLink className="w-3 h-3" /></a>
                </div>
            )}

            <div className="flex items-center gap-2">
                <button onClick={handleRun} disabled={!isReady} className="flex items-center gap-1.5 px-3 py-1 bg-green-600/10 hover:bg-green-600/20 text-green-500 rounded text-xs font-bold transition-all">
                    <Play className="w-3 h-3 fill-current" />
                    Run
                </button>
                <button onClick={handleRestart} disabled={!isReady} className="flex items-center gap-1.5 px-3 py-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded text-xs font-bold transition-all" title="Restart Shell">
                    <RefreshCcw className="w-3 h-3" />
                    Restart
                </button>
                <button onClick={saveProject} disabled={isSaving || !projectId} className={cn("flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all", isSaveSuccess ? "bg-green-600 text-white" : "bg-[#2b2b2b] hover:bg-[#3b3b3b] text-white disabled:opacity-50")}>
                    {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : isSaveSuccess ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                    {isSaving ? "Saving" : isSaveSuccess ? "Saved!" : "Save"}
                </button>
            </div>
        </div>

        <VSCodeLayout sidebarContent={<FileTree />} editor={<CodeEditor />} preview={<Preview externalUrl={previewUrl} />} previewUrl={previewUrl} terminal={<Terminal onData={handleTerminalData} />} />

        <AnimatePresence>
            {isNewProjectModalOpen && (
                <NewProjectModal onClose={() => setIsNewProjectModalOpen(false)} />
            )}
        </AnimatePresence>
    </div>
  );
}

function NewProjectModal({ onClose }: { onClose: () => void }) {
    const [isCreating, setIsCreating] = useState<string | null>(null);
    const templates = [
        { id: 'html', name: 'Static Site', icon: Globe, desc: 'HTML, CSS, JS sandbox', type: 'html' },
        { id: 'react-tailwind', name: 'React App', icon: Code2, desc: 'Vite + React + TS', type: 'react-tailwind' },
        { id: 'node', name: 'Node.js API', icon: TerminalIcon, desc: 'Express backend', type: 'node' },
        { id: 'fullstack-auth', name: 'Full Stack', icon: Layers, desc: 'React + Express', type: 'fullstack-auth' },
    ];

    const handleCreate = async (template: any) => {
        setIsCreating(template.id);
        try {
            const res = await api.post('/api/projects', {
                name: `My ${template.name}`,
                type: template.type,
                files: JSON.stringify({})
            });
            onClose();
            window.location.href = `/dashboard/ide?id=${res.data.id}`;
        } catch (err) {
            console.error(err);
        } finally {
            setIsCreating(null);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-[#1e1e1e] border border-[#454545] rounded-xl shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-[#2b2b2b] flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider">Create New Project</h2>
                    <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                    {templates.map(t => (
                        <button key={t.id} onClick={() => handleCreate(t)} disabled={!!isCreating} className="flex flex-col items-start p-4 bg-[#252526] hover:bg-[#2d2d2e] border border-white/5 rounded-lg text-left transition-all group">
                            <t.icon className="w-6 h-6 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                            <h4 className="text-sm font-bold text-white mb-1">{t.name}</h4>
                            <p className="text-[11px] text-neutral-500 leading-tight">{t.desc}</p>
                            {isCreating === t.id && <Loader2 className="w-3 h-3 animate-spin mt-2" />}
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
