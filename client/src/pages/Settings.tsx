import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Github, Key, Save, CheckCircle2, AlertCircle, Loader2, ChevronLeft, LayoutGrid, Settings as SettingsIcon, LogOut, Plus } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { cn } from "../lib/utils";
import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

export function Settings() {
    const { user, token, updateUser, logout } = useAuthStore();
    const [githubToken, setGithubToken] = useState(user?.githubToken || "");
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const navigate = useNavigate();

    const handleSaveGithub = async () => {
        setIsLoading(true);
        setStatus(null);
        try {
            const res = await axios.post(`${API_URL}/update-github`, { githubToken }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            updateUser(res.data.user);
            setStatus({ type: 'success', message: 'GitHub Token updated successfully!' });
        } catch (err: any) {
            setStatus({ type: 'error', message: err.response?.data?.error || 'Failed to update token' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans flex">
            {/* Sidebar (Same as Dashboard for consistency) */}
            <aside className="w-64 border-r border-white/5 bg-neutral-900/30 backdrop-blur-xl flex flex-col fixed h-full z-20">
                <div className="p-6">
                     <Link to="/" className="flex items-center gap-2 group cursor-pointer mb-8">
                        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">H</div>
                        <span className="font-bold text-lg tracking-tight">HOA Code Lab</span>
                    </Link>
                    <div className="space-y-1">
                        <button onClick={() => navigate("/dashboard")} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                            <LayoutGrid className="w-4 h-4" />
                            <span>Dashboard</span>
                        </button>
                        <button onClick={() => navigate("/dashboard/newproject")} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                            <Plus className="w-4 h-4" />
                            <span>New Project</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 text-white font-medium border border-white/5">
                            <SettingsIcon className="w-4 h-4" />
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

            {/* Main Content */}
            <main className="flex-1 ml-64 p-12">
                <header className="mb-12">
                    <div className="flex items-center gap-4 mb-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-lg text-neutral-400">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-4xl font-bold tracking-tight">Account Settings</h1>
                    </div>
                    <p className="text-neutral-400 ml-11">Manage your integrations and security preferences.</p>
                </header>

                <div className="max-w-2xl space-y-8">
                    {/* GitHub Integration Card */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-neutral-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-white">
                                <Github className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">GitHub Integration</h3>
                                <p className="text-sm text-neutral-500">Connect your account to store projects directly in your repositories.</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300 ml-1 flex items-center gap-2">
                                    <Key className="w-3.5 h-3.5 text-neutral-500" />
                                    Personal Access Token (PAT)
                                </label>
                                <input 
                                    type="password"
                                    value={githubToken}
                                    onChange={(e) => setGithubToken(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-neutral-700"
                                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                />
                                <p className="text-[11px] text-neutral-500 ml-1 mt-2 leading-relaxed">
                                    Required scopes: <span className="text-neutral-300">repo</span>, <span className="text-neutral-300">read:user</span>. 
                                    This token will be used to create repositories and push your project code.
                                </p>
                            </div>

                            {status && (
                                <div className={cn(
                                    "p-4 rounded-xl flex items-center gap-3 text-sm border",
                                    status.type === 'success' ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                                )}>
                                    {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                    {status.message}
                                </div>
                            )}

                            <button 
                                onClick={handleSaveGithub}
                                disabled={isLoading}
                                className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save GitHub Preferences
                            </button>
                        </div>
                    </motion.div>

                    {/* Temporary Storage Note */}
                    <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-4">
                        <AlertCircle className="w-6 h-6 text-blue-400 shrink-0" />
                        <div>
                            <h4 className="text-blue-100 font-semibold mb-1 text-sm">Storage Policy</h4>
                            <p className="text-xs text-blue-300/70 leading-relaxed">
                                Your projects are mirrored to GitHub for permanent storage. A local cache is kept on our servers for 7 days from the last edit to ensure fast access and execution.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
