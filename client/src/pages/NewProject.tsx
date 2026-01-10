import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { 
    ChevronLeft, 
    Code2, 
    Globe, 
    Terminal, 
    ArrowRight, 
    Sparkles,
    Loader2,
    LayoutGrid,
    Settings as SettingsIcon,
    LogOut,
    BookMarked,
    Plus,
    Lock,
    Cpu,
    Box,
    Database
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { cn } from "../lib/utils";
import axios from "axios";

const API_URL = "http://localhost:3000/api/projects";

const templates = [
    { id: 'html', name: 'Static Site', icon: Globe, desc: 'HTML, CSS, JS with live reload. Perfect for prototypes.', type: 'html', color: 'bg-orange-500' },
    { id: 'react-tailwind', name: 'React + Tailwind', icon: Code2, desc: 'Vite-powered React environment with Tailwind CSS v4.', type: 'react-tailwind', color: 'bg-blue-500' },
    { id: 'node', name: 'Node.js API', icon: Terminal, desc: 'Express server with real terminal access and Zod validation.', type: 'node', color: 'bg-green-500' },
    { id: 'fullstack-auth', name: 'Fullstack Auth', icon: Lock, desc: 'Complete JWT flow with React frontend and MySQL backend.', type: 'fullstack-auth', color: 'bg-purple-500' },
    { id: 'nextjs', name: 'Next.js SaaS', icon: Globe, desc: 'Premium SEO-optimized landing page with Framer Motion.', type: 'nextjs', color: 'bg-indigo-500' },
    { id: 'fastify', name: 'Fastify API', icon: Cpu, desc: 'Ultra-fast Node.js framework for high-performance backends.', type: 'fastify', color: 'bg-yellow-500' },
    { id: 'admin-dashboard', name: 'Admin UI', icon: LayoutGrid, desc: 'Complex charts, tables, and management dashboards.', type: 'admin-dashboard', color: 'bg-pink-500' },
    { id: 'ts-lib', name: 'TS Library', icon: Box, desc: 'TypeScript package boilerplate with Vitest testing.', type: 'ts-lib', color: 'bg-blue-400' },
    { id: 'drizzle-orm', name: 'Drizzle/MySQL', icon: Database, desc: 'Type-safe database setup with migration management.', type: 'drizzle-orm', color: 'bg-emerald-500' },
];

const Background = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
    </div>
);

export function NewProject() {
    const { token, logout } = useAuthStore();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const [isCreating, setIsCreating] = useState<string | null>(null);
    const [projectName, setProjectName] = useState(searchParams.get("name") || "");

    const handleCreate = async (template: any) => {
        const finalName = projectName.trim() || `My ${template.name}`;
        setIsCreating(template.id);
        try {
            const res = await axios.post(API_URL, {
                name: finalName,
                type: template.type,
                files: JSON.stringify({})
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate(`/dashboard/ide?id=${res.data.id}`);
        } catch (err) {
            console.error(err);
        } finally {
            setIsCreating(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans flex">
            <Background />
            
            <aside className="w-64 border-r border-white/5 bg-neutral-900/30 backdrop-blur-xl flex flex-col fixed h-full z-20">
                <div className="p-6">
                     <Link to="/" className="flex items-center gap-2 group cursor-pointer mb-8 text-white">
                        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center font-bold">H</div>
                        <span className="font-bold text-lg tracking-tight">HOA Code Lab</span>
                    </Link>
                    <div className="space-y-1">
                        <button onClick={() => navigate("/dashboard")} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                            <LayoutGrid className="w-4 h-4" />
                            <span>Dashboard</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 text-white font-medium border border-white/5">
                            <Plus className="w-4 h-4" />
                            <span>New Project</span>
                        </button>
                        <button onClick={() => navigate("/dashboard/templates")} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                            <BookMarked className="w-4 h-4" />
                            <span>Templates</span>
                        </button>
                        <button onClick={() => navigate("/settings")} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
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

            <main className="flex-1 ml-64 p-12 overflow-y-auto">
                <header className="mb-12">
                    <div className="flex items-center gap-4 mb-2">
                        <button onClick={() => navigate("/dashboard")} className="p-2 hover:bg-white/5 rounded-lg text-neutral-400">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-4xl font-bold tracking-tight">Create New Project</h1>
                    </div>
                    <p className="text-neutral-400 ml-11 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        Choose a template to launch your cloud workspace.
                    </p>
                </header>

                <div className="max-w-5xl">
                    <div className="mb-10 ml-11 max-w-md">
                        <label className="text-sm font-medium text-neutral-400 mb-2 block ml-1">Project Name</label>
                        <input 
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="e.g. My Awesome App"
                            className="w-full bg-neutral-900 border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 ml-11 pb-20">
                        {templates.map((template, idx) => (
                            <motion.button
                                key={template.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => handleCreate(template)}
                                disabled={!!isCreating}
                                className="group relative flex flex-col items-start p-6 bg-neutral-900/40 border border-white/5 rounded-3xl text-left transition-all hover:border-white/10 hover:bg-neutral-900/60 overflow-hidden"
                            >
                                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500", template.color)} />
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", template.color.replace('bg-', 'bg-') + '/10', template.color.replace('bg-', 'text-'))}>
                                    <template.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-1 group-hover:text-blue-400 transition-colors">{template.name}</h3>
                                <p className="text-xs text-neutral-500 leading-relaxed mb-6 flex-1">{template.desc}</p>
                                <div className="flex items-center justify-between w-full mt-auto">
                                    <div className="flex items-center gap-2 text-white font-bold text-xs">
                                        {isCreating === template.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                                        {isCreating === template.id ? 'Creating...' : 'Select'}
                                    </div>
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}