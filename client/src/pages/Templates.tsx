import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
    LayoutGrid, 
    Code2, 
    Globe, 
    Terminal, 
    Search,
    Settings as SettingsIcon,
    LogOut,
    Plus,
    BookMarked,
    Sparkles,
    ArrowUpRight,
    Filter,
    Lock,
    Cpu,
    Box,
    Database
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { cn } from "../lib/utils";

const Background = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen" />
    </div>
);

const CATEGORIES = ["All", "Frontend", "Backend", "Fullstack", "Learning"];

const TEMPLATES = [
    { id: 1, name: "React + Tailwind Starter", category: "Frontend", icon: Code2, desc: "A clean slate with Vite, React 19, and Tailwind CSS v4 pre-installed.", tech: ["React", "Vite", "Tailwind"], type: "react-tailwind" },
    { id: 2, name: "Express API Boilerplate", category: "Backend", icon: Terminal, desc: "Production-ready Node.js server with environment config and routing.", tech: ["Node.js", "Express", "Zod"], type: "node" },
    { id: 3, name: "Fullstack Auth System", category: "Fullstack", icon: Lock, desc: "Complete JWT authentication flow with React frontend and MySQL backend.", tech: ["JWT", "MySQL", "React"], type: "fullstack-auth" },
    { id: 4, name: "Next.js SaaS Landing", category: "Frontend", icon: Globe, desc: "Premium SaaS landing page template with Framer Motion and optimized SEO.", tech: ["Next.js", "React", "Motion"], type: "nextjs" },
    { id: 5, name: "FastAPI Backend", category: "Backend", icon: Cpu, desc: "High-performance API using Node + Fastify (Python-like speed).", tech: ["Node", "Fastify", "Zod"], type: "fastify" },
    { id: 6, name: "Admin Dashboard UI", category: "Frontend", icon: LayoutGrid, desc: "Comprehensive admin interface with charts, tables, and complex layouts.", tech: ["React", "Recharts", "UI"], type: "admin-dashboard" },
    { id: 7, name: "TypeScript Library", category: "Backend", icon: Box, desc: "Ready-to-publish NPM package template with Vitest.", tech: ["TS", "NPM", "Vitest"], type: "ts-lib" },
    { id: 8, name: "Socket.IO Realtime", category: "Fullstack", icon: Sparkles, desc: "Low-latency bidirectional communication for chats or gaming.", tech: ["Socket.io", "Express"], type: "socket-io" },
    { id: 9, name: "Drizzle ORM Template", category: "Backend", icon: Database, desc: "Type-safe database setup with Drizzle ORM and migration management.", tech: ["Drizzle", "MySQL", "TS"], type: "drizzle-orm" },
];

export function Templates() {
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTemplates = TEMPLATES.filter(t => 
        (selectedCategory === "All" || t.category === selectedCategory) &&
        (t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans flex">
            <Background />
            
            {/* Sidebar */}
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
                        <button onClick={() => navigate("/dashboard/newproject")} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                            <Plus className="w-4 h-4" />
                            <span>New Project</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 text-white font-medium border border-white/5">
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

            {/* Main Content */}
            <main className="flex-1 ml-64 p-12">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">Template Gallery</h1>
                        <p className="text-neutral-400 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            Pre-built environments to kickstart your next big idea.
                        </p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                        <input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-neutral-900 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 w-72 transition-all"
                            placeholder="Search templates..."
                        />
                    </div>
                </header>

                {/* Categories */}
                <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
                    <Filter className="w-4 h-4 text-neutral-500 mr-2 shrink-0" />
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                                selectedCategory === cat 
                                    ? "bg-white text-black border-white" 
                                    : "bg-neutral-900 text-neutral-400 border-white/5 hover:border-white/10 hover:text-white"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template, idx) => (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group bg-neutral-900/40 border border-white/5 rounded-[2rem] p-6 hover:bg-neutral-900/60 hover:border-white/10 transition-all flex flex-col"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <template.icon className="w-6 h-6 text-blue-400" />
                            </div>
                            
                            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{template.name}</h3>
                            <p className="text-sm text-neutral-500 leading-relaxed mb-6 flex-1">
                                {template.desc}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {template.tech.map(t => (
                                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-neutral-400 border border-white/5 font-mono">{t}</span>
                                ))}
                            </div>

                            <button 
                                onClick={() => navigate(`/dashboard/newproject?template=${template.type}&name=${encodeURIComponent(template.name)}`)}
                                className="w-full bg-white/5 hover:bg-white text-white hover:text-black py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group/btn"
                            >
                                Use Template
                                <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
