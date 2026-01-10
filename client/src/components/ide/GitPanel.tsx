import { useState, useEffect } from "react";
import { useCodeStore } from "../../store/useCodeStore";
import { useAuthStore } from "../../store/useAuthStore";
import { 
    GitBranch, 
    Check, 
    RotateCcw, 
    Loader2, 
    FileCode, 
    MoreHorizontal,
    RefreshCw,
    History,
    ChevronDown,
    Clock,
    User as UserIcon,
    Github,
    ArrowUpRight,
    CloudUpload
} from "lucide-react";
import { cn } from "../../lib/utils";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const API_URL = "http://localhost:3000/api/projects";

export function GitPanel() {
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get("id");
    const { token } = useAuthStore();
    const { files, setFiles, activeProject, setActiveProject } = useCodeStore();
    
    const [commitMessage, setCommitMessage] = useState("");
    const [isPushing, setIsPushing] = useState(false);
    const [isPulling, setIsPulling] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const [gitData, setGitData] = useState<{ branches: string[], commits: any[] } | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState<string[]>(['changes', 'history']);

    useEffect(() => {
        if (projectId && activeProject?.githubRepo) {
            fetchGitInfo();
        }
    }, [projectId, activeProject?.githubRepo]);

    const fetchGitInfo = async () => {
        try {
            const res = await axios.get(`${API_URL}/${projectId}/git-info`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGitData(res.data);
        } catch (err) {
            console.error("Failed to fetch git info");
        }
    };

    const handleInitRepo = async () => {
        if (!projectId) return;
        setIsInitializing(true);
        setStatus("Initializing repository...");
        try {
            const res = await axios.post(`${API_URL}/${projectId}/init-repo`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setActiveProject(res.data);
            setStatus("Repository linked!");
            setTimeout(() => setStatus(null), 3000);
        } catch (err: any) {
            setStatus(err.response?.data?.error || "Initialization failed");
        } finally {
            setIsInitializing(false);
        }
    };

    const handlePush = async () => {
        if (!projectId || !commitMessage) return;
        setIsPushing(true);
        setStatus("Pushing to GitHub...");
        try {
            await axios.post(`${API_URL}/${projectId}/push`, {
                message: commitMessage
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatus("Pushed successfully");
            setCommitMessage("");
            fetchGitInfo();
            setTimeout(() => setStatus(null), 3000);
        } catch (err: any) {
            setStatus(err.response?.data?.error || "Push failed");
        } finally {
            setIsPushing(false);
        }
    };

    const handlePull = async () => {
        if (!projectId) return;
        setIsPulling(true);
        setStatus("Pulling...");
        try {
            const res = await axios.post(`${API_URL}/${projectId}/pull`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFiles(res.data.files);
            setStatus("Synced");
            fetchGitInfo();
            setTimeout(() => setStatus(null), 3000);
        } catch (err) {
            setStatus("Pull failed");
        } finally {
            setIsPulling(false);
        }
    };

    const toggleSection = (section: string) => {
        setActiveSection(prev => 
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };

    const changedFiles = Object.values(files).filter(f => f.type === 'file');

    return (
        <div className="h-full flex flex-col bg-[#181818] text-[#cccccc] font-sans select-none">
            {/* Header */}
            <div className="p-4 border-b border-[#2b2b2b] flex items-center justify-between shrink-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#858585]">Source Control</span>
                {activeProject?.githubRepo && (
                    <div className="flex items-center gap-2">
                        <button onClick={handlePull} disabled={isPulling} className="p-1 hover:bg-[#37373d] rounded text-[#858585] hover:text-[#cccccc]" title="Pull / Sync">
                            {isPulling ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        </button>
                        <button className="p-1 hover:bg-[#37373d] rounded text-[#858585] hover:text-[#cccccc]"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {!activeProject?.githubRepo ? (
                    /* Initial State: Publish to GitHub */
                    <div className="p-6 text-center space-y-4 animate-in fade-in duration-500">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20 shadow-inner">
                            <CloudUpload className="w-6 h-6 text-[#007fd4]" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white mb-1">Publish to GitHub</h3>
                            <p className="text-[11px] text-[#858585] leading-relaxed px-2">
                                This project isn't connected to a repository yet. Initialize it now to enable cloud storage.
                            </p>
                        </div>
                        <button 
                            onClick={handleInitRepo}
                            disabled={isInitializing}
                            className="w-full bg-[#007fd4] hover:bg-[#0062a3] disabled:bg-[#007fd4]/30 text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            {isInitializing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Github className="w-3.5 h-3.5" />}
                            Initialize Repository
                        </button>
                        {status && <div className="text-[10px] text-red-400 font-medium">{status}</div>}
                    </div>
                ) : (
                    /* Active State: Git Controls */
                    <>
                        {/* Repository Info */}
                        <div className="px-4 py-2 border-b border-[#2b2b2b] bg-[#252526]/30">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] text-[#858585] uppercase font-bold">Remote</span>
                                <Github className="w-3 h-3 text-[#858585]" />
                            </div>
                            <a 
                                href={`https://github.com/${activeProject.githubRepo}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1.5 truncate"
                            >
                                <ArrowUpRight className="w-3 h-3" />
                                {activeProject.githubRepo}
                            </a>
                        </div>

                        {/* Commit Input */}
                        <div className="p-4 border-b border-[#2b2b2b]">
                            <div className="space-y-2">
                                <textarea 
                                    value={commitMessage}
                                    onChange={(e) => setCommitMessage(e.target.value)}
                                    placeholder="Message (Ctrl+Enter to commit)"
                                    className="w-full h-16 bg-[#3c3c3c] border border-transparent focus:border-[#007fd4] rounded p-2 text-xs outline-none resize-none placeholder:text-[#71717a]"
                                />
                                <button 
                                    onClick={handlePush}
                                    disabled={isPushing || !commitMessage}
                                    className="w-full bg-[#007fd4] hover:bg-[#0062a3] disabled:bg-[#007fd4]/30 text-white py-1.5 rounded text-xs font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    {isPushing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                    Commit & Push
                                </button>
                                {status && <div className="text-[10px] text-[#007fd4] text-center italic">{status}</div>}
                            </div>
                        </div>

                        {/* Changes Section */}
                        <div className="flex flex-col">
                            <SectionHeader title="Changes" count={changedFiles.length} isOpen={activeSection.includes('changes')} onClick={() => toggleSection('changes')} />
                            {activeSection.includes('changes') && (
                                <div className="py-1">
                                    {changedFiles.map(file => (
                                        <div key={file.path} className="flex items-center gap-2 py-1 px-4 hover:bg-[#2a2d2e] cursor-pointer group">
                                            <FileCode className="w-4 h-4 text-[#858585]" />
                                            <span className="text-xs truncate flex-1">{file.name}</span>
                                            <span className="text-[10px] text-orange-400 font-bold group-hover:hidden">M</span>
                                            <button className="hidden group-hover:block p-0.5 hover:bg-[#454545] rounded text-[#858585] hover:text-[#cccccc]"><RotateCcw className="w-3 h-3" /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* History Section */}
                        <div className="flex flex-col border-t border-[#2b2b2b]">
                            <SectionHeader title="Timeline / History" icon={History} isOpen={activeSection.includes('history')} onClick={() => toggleSection('history')} />
                            {activeSection.includes('history') && (
                                <div className="py-2 px-4 space-y-4">
                                    {gitData?.commits.map((commit) => (
                                        <div key={commit.sha} className="relative pl-4 border-l border-[#2b2b2b] pb-4 last:pb-0">
                                            <div className="absolute -left-[4.5px] top-1 w-2 h-2 rounded-full bg-[#007fd4]" />
                                            <div className="space-y-1">
                                                <p className="text-xs font-medium text-white line-clamp-2 leading-snug">{commit.message}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-[#858585]">
                                                    <span className="flex items-center gap-1"><UserIcon className="w-2.5 h-2.5" /> {commit.author}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {new Date(commit.date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="text-[9px] font-mono text-blue-400/70 bg-blue-400/5 px-1.5 py-0.5 rounded w-fit">
                                                    {commit.sha.substring(0, 7)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!gitData || gitData.commits.length === 0) && (
                                        <div className="text-[11px] text-neutral-600 italic py-2">No commit history found</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Bottom Info / Branch Selector */}
            <div className="p-3 bg-[#252526] border-t border-[#2b2b2b] shrink-0">
                <button className="flex items-center justify-between w-full text-[11px] text-[#858585] hover:text-white transition-colors group">
                    <div className="flex items-center gap-2">
                        <GitBranch className="w-3.5 h-3.5" />
                        <span>Branch: <span className="text-[#cccccc] font-medium">main</span></span>
                    </div>
                    <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>
        </div>
    );
}

function SectionHeader({ title, count, isOpen, onClick, icon: Icon }: any) {
    return (
        <div 
            className="flex items-center gap-1 px-1 py-1 bg-[#252526]/50 hover:bg-[#2a2d2e] cursor-pointer group"
            onClick={onClick}
        >
            <ChevronDown className={cn("w-4 h-4 text-[#858585] transition-transform", !isOpen && "-rotate-90")} />
            <div className="flex items-center gap-2 flex-1">
                {Icon && <Icon className="w-3.5 h-3.5 text-[#858585]" />}
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#bbbbbb]">{title}</span>
            </div>
            {count !== undefined && <span className="text-[10px] bg-[#37373d] px-1.5 py-0.5 rounded-full text-[#cccccc] mr-2">{count}</span>}
        </div>
    );
}
