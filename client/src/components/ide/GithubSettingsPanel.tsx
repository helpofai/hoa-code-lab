import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { 
    Github, 
    CheckCircle2, 
    AlertCircle, 
    Loader2, 
    Save, 
    ShieldCheck, 
    Activity,
    Lock,
    Globe,
    RefreshCcw,
    GitBranch
} from "lucide-react";
import { cn } from "../../lib/utils";
import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

export function GithubSettingsPanel() {
    const { user, token, updateUser } = useAuthStore();
    const [githubToken, setGithubToken] = useState(user?.githubToken || "");
    const [isLoading, setIsLoading] = useState(false);
    const [diagData, setDiagData] = useState<{ profile: any, rateLimit: any, scopes: string[] } | null>(null);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Sync settings state
    const [visibility, setVisibility] = useState(user?.githubRepoVisibility || 'private');
    const [autoSync, setAutoSync] = useState(user?.githubAutoSync ?? true);
    const [branch, setBranch] = useState(user?.githubDefaultBranch || 'main');

    useEffect(() => {
        if (user?.githubToken) {
            fetchDiagnostics();
        }
    }, [user?.githubToken]);

    const fetchDiagnostics = async () => {
        try {
            const res = await axios.get(`${API_URL}/github-profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDiagData(res.data);
        } catch (err) {
            setDiagData(null);
        }
    };

    const handleSaveToken = async () => {
        const trimmed = githubToken.trim();
        if (!trimmed) return;
        
        setIsLoading(true);
        setStatus(null);
        try {
            const res = await axios.post(`${API_URL}/update-github`, { githubToken: trimmed }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            updateUser(res.data.user);
            setStatus({ type: 'success', message: 'Token verified' });
            setTimeout(() => setStatus(null), 3000);
        } catch (err: any) {
            const msg = err.response?.data?.error || 'Invalid Token';
            setStatus({ type: 'error', message: msg });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateSettings = async (updates: any) => {
        try {
            const res = await axios.post(`${API_URL}/update-github-settings`, updates, {
                headers: { Authorization: `Bearer ${token}` }
            });
            updateUser(res.data.user);
        } catch (err) {
            console.error("Failed to update settings");
        }
    };

    const handleDisconnect = async () => {
        if(!confirm("Disconnect GitHub account?")) return;
        setIsLoading(true);
        try {
            const res = await axios.post(`${API_URL}/update-github`, { githubToken: "" }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            updateUser(res.data.user);
            setDiagData(null);
            setGithubToken("");
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-[#181818] text-[#cccccc] font-sans">
            <div className="p-4 border-b border-[#2b2b2b] flex items-center justify-between shrink-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#858585]">GitHub Connection</span>
                {diagData && (
                    <button onClick={handleDisconnect} className="text-[10px] text-red-400 hover:text-red-300 transition-colors">Disconnect</button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {diagData ? (
                    <div className="p-4 space-y-6 animate-in fade-in duration-500">
                        {/* Status Header */}
                        <div className="flex items-center gap-3 p-3 bg-[#252526] rounded-xl border border-white/5">
                            <img src={diagData.profile.avatar_url} className="w-10 h-10 rounded-full border border-white/10" alt="" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{diagData.profile.login}</p>
                                <div className="flex items-center gap-1.5 text-[10px] text-green-500 font-medium uppercase">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    Active Connection
                                </div>
                            </div>
                        </div>

                        {/* Health Metrics */}
                        <div className="space-y-3">
                            <div className="text-[10px] font-bold text-[#858585] uppercase px-1">Health & Limits</div>
                            <div className="grid grid-cols-2 gap-2">
                                <MetricCard 
                                    icon={Activity} 
                                    label="API Rate Limit" 
                                    value={`${diagData.rateLimit.remaining}/${diagData.rateLimit.limit}`} 
                                />
                                <MetricCard 
                                    icon={ShieldCheck} 
                                    label="Token Scopes" 
                                    value={`${diagData.scopes.length} Active`} 
                                />
                            </div>
                        </div>

                        {/* Configuration */}
                        <div className="space-y-4">
                            <div className="text-[10px] font-bold text-[#858585] uppercase px-1">Sync Preferences</div>
                            
                            <div className="space-y-3">
                                <OptionToggle 
                                    icon={visibility === 'private' ? Lock : Globe}
                                    label="Repo Visibility"
                                    value={visibility === 'private' ? 'Private' : 'Public'}
                                    onClick={() => {
                                        const newVal = visibility === 'private' ? 'public' : 'private';
                                        setVisibility(newVal);
                                        handleUpdateSettings({ githubRepoVisibility: newVal });
                                    }}
                                />
                                <OptionToggle 
                                    icon={RefreshCcw}
                                    label="Auto Sync"
                                    value={autoSync ? 'Enabled' : 'Disabled'}
                                    active={autoSync}
                                    onClick={() => {
                                        setAutoSync(!autoSync);
                                        handleUpdateSettings({ githubAutoSync: !autoSync });
                                    }}
                                />
                                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-medium text-white">
                                        <GitBranch className="w-3.5 h-3.5 text-[#007fd4]" />
                                        Default Branch
                                    </div>
                                    <input 
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value)}
                                        onBlur={() => handleUpdateSettings({ githubDefaultBranch: branch })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[11px] outline-none text-blue-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Initial Setup */
                    <div className="p-5 space-y-6">
                        <div className="text-center py-4">
                            <Github className="w-12 h-12 text-white/20 mx-auto mb-4" />
                            <h3 className="text-sm font-bold text-white mb-2">Initialize GitHub</h3>
                            <p className="text-[11px] text-[#858585] leading-relaxed">Provide a Personal Access Token to enable permanent cloud storage and version control.</p>
                        </div>

                        <div className="space-y-4 bg-[#252526] p-4 rounded-xl border border-white/5 shadow-xl">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#858585] uppercase">Access Token</label>
                                <input 
                                    type="password"
                                    value={githubToken}
                                    onChange={(e) => setGithubToken(e.target.value)}
                                    className="w-full bg-[#1e1e1e] border border-[#3c3c3c] focus:border-[#007fd4] rounded-lg px-3 py-2 text-xs outline-none text-white transition-all"
                                    placeholder="ghp_xxxxxxxxxxxx"
                                />
                            </div>

                            {status && (
                                <div className={cn(
                                    "px-3 py-2 rounded-lg text-[10px] flex items-center gap-2 border",
                                    status.type === 'success' ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                                )}>
                                    {status.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                                    {status.message}
                                </div>
                            )}

                            <button 
                                onClick={handleSaveToken}
                                disabled={isLoading || !githubToken}
                                className="w-full bg-[#007fd4] hover:bg-[#0062a3] text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                Connect Account
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function MetricCard({ icon: Icon, label, value }: any) {
    return (
        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
            <div className="flex items-center gap-2 text-[10px] text-[#858585] mb-1">
                <Icon className="w-3 h-3 text-[#007fd4]" />
                {label}
            </div>
            <div className="text-xs font-bold text-white">{value}</div>
        </div>
    );
}

function OptionToggle({ icon: Icon, label, value, onClick, active = true }: any) {
    return (
        <button 
            onClick={onClick}
            className="w-full flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-colors"
        >
            <div className="flex items-center gap-3">
                <Icon className={cn("w-4 h-4", active ? "text-[#007fd4]" : "text-[#858585]")} />
                <div className="text-left">
                    <div className="text-[11px] text-[#858585] leading-none mb-1">{label}</div>
                    <div className="text-xs font-bold text-white">{value}</div>
                </div>
            </div>
            <div className={cn("w-8 h-4 rounded-full relative transition-colors", active ? "bg-[#007fd4]" : "bg-[#3c3c3c]")}>
                <div className={cn("absolute top-1 w-2 h-2 bg-white rounded-full transition-all", active ? "right-1" : "left-1")} />
            </div>
        </button>
    );
}
