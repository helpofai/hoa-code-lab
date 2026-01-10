import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
    Plus, Search, Settings, LogOut, LayoutGrid, Folder, 
    Play, Trash2, Loader2, Github, Globe, Lock, X,
    DownloadCloud, BookMarked
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useState, useEffect } from "react";
import { api } from "../lib/api";

const Background = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen" />
    </div>
);

export function Dashboard() {
    const { token, logout } = useAuthStore();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/api/projects');
            setProjects(res.data);
        } catch (err) {
            console.error("Failed to fetch projects", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateProject = async () => {
        try {
            const res = await api.post('/api/projects', {
                name: "New Project",
                type: "react",
                files: JSON.stringify({})
            });
            navigate(`/dashboard/ide?id=${res.data.id}`);
        } catch (err) {
            console.error("Failed to create project", err);
        }
    };

    const handleDeleteProject = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/api/projects/${id}`);
            setProjects(projects.filter(p => p.id !== id));
        } catch (err) {
            console.error("Failed to delete project", err);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 flex">
            <Background />
            
            <aside className="w-64 border-r border-white/5 bg-neutral-900/30 backdrop-blur-xl flex flex-col fixed h-full z-20">
                <div className="p-6">
                     <Link to="/" className="flex items-center gap-2 group cursor-pointer mb-8">
                        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">H</div>
                        <span className="font-bold text-lg tracking-tight">HOA Code Lab</span>
                    </Link>
                    <div className="space-y-1">
                        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 text-white font-medium border border-white/5">
                            <LayoutGrid className="w-4 h-4" />
                            <span>Dashboard</span>
                        </button>
                        <button 
                            onClick={() => navigate("/dashboard/newproject")}
                            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>New Project</span>
                        </button>
                        <button 
                            onClick={() => setIsImportModalOpen(true)}
                            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            <span>Import Git</span>
                        </button>
                        <button 
                            onClick={() => navigate("/dashboard/templates")}
                            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <BookMarked className="w-4 h-4" />
                            <span>Templates</span>
                        </button>
                        <button onClick={() => navigate("/settings")} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                        </button>
                    </div>
                </div>
                <div className="mt-auto p-6 border-t border-white/5">
                    <button onClick={() => { logout(); navigate("/"); }} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-sm">
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 ml-64 p-8">
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Overview</h1>
                        <p className="text-neutral-400 text-sm">Manage your cloud workspaces.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative mr-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                            <input 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-neutral-900 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500/50 w-64 placeholder:text-neutral-600"
                                placeholder="Search..."
                            />
                        </div>
                        <button 
                            onClick={() => setIsImportModalOpen(true)}
                            className="bg-neutral-800 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-neutral-700 transition-colors flex items-center gap-2 border border-white/5"
                        >
                            <Github className="w-4 h-4" />
                            Import
                        </button>
                        <button 
                            onClick={handleCreateProject}
                            className="bg-white text-black px-4 py-2 rounded-xl font-bold text-sm hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-lg shadow-white/5"
                        >
                            <Plus className="w-4 h-4" />
                            New Project
                        </button>
                    </div>
                </header>

                {isLoading ? (
                    <div className="h-64 flex items-center justify-center">
                         <Loader2 className="w-8 h-8 animate-spin text-neutral-600" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-neutral-500 border border-white/5 border-dashed rounded-3xl">
                        <Folder className="w-12 h-12 mb-4 opacity-20" />
                        <p>No projects yet. Create or import one to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).map((project) => (
                            <motion.div 
                                key={project.id}
                                layoutId={`project-${project.id}`}
                                onClick={() => navigate(`/dashboard/ide?id=${project.id}`)}
                                className="group bg-neutral-900/40 border border-white/5 hover:border-white/10 rounded-2xl p-5 hover:bg-neutral-900/60 transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteProject(project.id); }} className="p-1.5 hover:bg-red-500/10 rounded-lg text-neutral-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/5 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                                    {project.githubRepo ? <Github className="w-6 h-6 text-blue-400" /> : <span className="font-bold text-lg text-neutral-400">{project.name.charAt(0)}</span>}
                                </div>
                                <h3 className="font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors">{project.name}</h3>
                                <p className="text-sm text-neutral-500 mb-6 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                    {new Date(project.updatedAt).toLocaleDateString()}
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                     <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/5 text-neutral-300 border border-white/5 uppercase">
                                        {project.type}
                                     </span>
                                     <button className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all shadow-lg"><Play className="w-3.5 h-3.5 fill-current" /></button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            <AnimatePresence>
                {isImportModalOpen && (
                    <ImportModal 
                        onClose={() => setIsImportModalOpen(false)} 
                        token={token!} 
                        onImported={fetchProjects}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function ImportModal({ onClose, onImported }: { onClose: () => void, token: string, onImported: () => void }) {
    const [repos, setRepos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isImporting, setIsImporting] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchRepos();
    }, []);

    const fetchRepos = async () => {
        try {
            const res = await api.get('/api/auth/github-repos');
            setRepos(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImport = async (repo: any) => {
        setIsImporting(repo.full_name);
        try {
            const res = await api.post('/api/projects/import', {
                repoFullName: repo.full_name,
                name: repo.name
            });
            onImported();
            navigate(`/dashboard/ide?id=${res.data.id}`);
        } catch (err) {
            alert("Failed to import repository. Ensure the token has sufficient permissions.");
        } finally {
            setIsImporting(null);
        }
    };

    const filteredRepos = repos.filter(r => r.full_name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                            <DownloadCloud className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Import Repository</h2>
                            <p className="text-xs text-neutral-500">Clone your existing GitHub projects.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-neutral-500 transition-colors"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-4 border-b border-white/5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50"
                            placeholder="Search your repositories..."
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {isLoading ? (
                        <div className="h-40 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-neutral-700" /></div>
                    ) : filteredRepos.length === 0 ? (
                        <div className="h-40 flex flex-col items-center justify-center text-neutral-600 italic text-sm">
                            <Github className="w-8 h-8 mb-2 opacity-20" />
                            No repositories found matching your search.
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            {filteredRepos.map(repo => (
                                <div key={repo.id} className="group flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 hover:bg-white/[0.04] transition-all">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-500 group-hover:text-blue-400 transition-colors">
                                            {repo.private ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-sm font-bold truncate">{repo.full_name}</h4>
                                            <p className="text-[11px] text-neutral-500 truncate">{repo.description || "No description"}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleImport(repo)}
                                        disabled={!!isImporting}
                                        className="ml-4 bg-white text-black px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2 whitespace-nowrap"
                                    >
                                        {isImporting === repo.full_name ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Plus className="w-3 h-3" /> Import</>}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 bg-white/[0.02] border-t border-white/5 text-center">
                    <p className="text-[10px] text-neutral-500">
                        Repositories are sorted by last updated. Private repositories require the <code className="text-blue-400">repo</code> scope.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
