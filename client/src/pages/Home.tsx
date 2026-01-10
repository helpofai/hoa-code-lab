import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowRight, Code2, Cpu, Globe, Layers, LayoutTemplate, Play, Terminal, Zap, Sparkles, Box, GitBranch } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import type { MouseEvent } from "react";

// --- Advanced Components ---

// 1. Mesh Background with Floating Orbs
const Background = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[120px]" />
        </div>
    );
};

// 2. Spotlight Hero Button
const SpotlightButton = ({ children, className, ...props }: any) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className={cn(
                "group relative border border-neutral-800 bg-neutral-900 overflow-hidden rounded-xl",
                className
            )}
            onMouseMove={handleMouseMove}
            {...props}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.1),
              transparent 80%
            )
          `,
                }}
            />
            <div className="relative">{children}</div>
        </div>
    );
};

const Hero = () => {
  return (
    <section className="relative pt-32 pb-40 overflow-hidden">
      <Background />
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Content */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                <Sparkles className="w-3 h-3" />
                <span>v2.0 is now live</span>
            </div>
            <h1 className="text-7xl font-bold tracking-tight leading-[1.1]">
              Build for the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 animate-gradient-x">
                Modern Web.
              </span>
            </h1>
            <p className="mt-6 text-xl text-neutral-400 max-w-lg leading-relaxed">
              The first full-stack IDE that runs entirely in your browser. <br/>
              <span className="text-neutral-200 font-medium">Node.js, Docker-style containers, and instant previews.</span>
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <Link 
              to="/dashboard/ide" 
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-blue-600 px-8 font-medium text-white shadow-2xl transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-neutral-900"
            >
              <span className="mr-2">Start Coding</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 -z-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat transition-[background-position_0s] duration-0 group-hover:bg-[position:200%_0,0_0] group-hover:duration-[1500ms]" />
            </Link>
            
            <button className="px-8 py-4 rounded-xl font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                <Play className="w-4 h-4" />
                Watch Demo
            </button>
          </motion.div>
          
          <div className="flex items-center gap-4 text-sm text-neutral-500 pt-4">
            <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-neutral-950 bg-neutral-800" />
                ))}
            </div>
            <p>Used by 10,000+ developers</p>
          </div>
        </div>

        {/* Right Content - Advanced Mock Editor */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, type: "spring" }}
          className="relative perspective-1000"
        >
            {/* Ambient Glow behind editor */}
            <div className="absolute -inset-10 bg-gradient-to-tr from-blue-600/30 to-purple-600/30 opacity-50 blur-[60px] rounded-[3rem]" />
            
            <div className="relative bg-[#0A0A0A] border border-neutral-800/50 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 backdrop-blur-xl transform rotate-y-[-5deg] hover:rotate-y-0 transition-transform duration-700 ease-out-expo">
                
                {/* Editor Toolbar */}
                <div className="h-12 border-b border-neutral-800 flex items-center justify-between px-4 bg-white/5">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                        <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                    </div>
                    <div className="flex items-center gap-3 px-3 py-1 bg-black/40 rounded-lg text-xs font-mono text-neutral-400 border border-white/5">
                        <Globe className="w-3 h-3" />
                        <span>localhost:3000</span>
                    </div>
                </div>

                {/* Editor Content Area */}
                <div className="grid grid-cols-[200px_1fr] h-[450px]">
                    {/* Sidebar */}
                    <div className="border-r border-neutral-800 p-4 space-y-3 hidden sm:block">
                        <div className="flex items-center gap-2 text-neutral-400 text-sm">
                            <Box className="w-4 h-4" />
                            <span>src</span>
                        </div>
                        <div className="pl-4 space-y-2">
                            <div className="flex items-center gap-2 text-blue-400 text-sm bg-blue-500/10 px-2 py-1 rounded">
                                <Code2 className="w-3 h-3" />
                                <span>App.tsx</span>
                            </div>
                            <div className="flex items-center gap-2 text-neutral-500 text-sm px-2 py-1">
                                <Code2 className="w-3 h-3" />
                                <span>main.tsx</span>
                            </div>
                            <div className="flex items-center gap-2 text-neutral-500 text-sm px-2 py-1">
                                <LayoutTemplate className="w-3 h-3" />
                                <span>index.css</span>
                            </div>
                        </div>
                    </div>

                    {/* Code Area */}
                    <div className="p-6 font-mono text-sm leading-relaxed text-blue-100/80 bg-black/20 relative">
                         {/* Typing Animation Overlay */}
                        <motion.div 
                            className="absolute top-6 left-6 w-0.5 h-5 bg-blue-400"
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        />
                        
                        <div>
                            <span className="text-purple-400">import</span> React <span className="text-purple-400">from</span> <span className="text-green-400">'react'</span>;<br/>
                            <span className="text-purple-400">import</span> {'{'} motion {'}'} <span className="text-purple-400">from</span> <span className="text-green-400">'framer-motion'</span>;<br/>
                            <br/>
                            <span className="text-purple-400">export default</span> <span className="text-blue-400">function</span> <span className="text-yellow-400">App</span>() {'{'}<br/>
                            &nbsp;&nbsp;<span className="text-purple-400">return</span> (<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-red-400">motion.div</span><br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-orange-400">initial</span>={'{'}{'{'} opacity: 0 {'}'}{'}'}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-orange-400">animate</span>={'{'}{'{'} opacity: 1 {'}'}{'}'}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&gt;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-red-400">h1</span>&gt;Hello Future&lt;/<span className="text-red-400">h1</span>&gt;<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-red-400">motion.div</span>&gt;<br/>
                            &nbsp;&nbsp;);<br/>
                            {'}'}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
      </div>
    </section>
  );
};

const QuickStartCard = ({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) => (
    <SpotlightButton className="h-full">
        <Link to="/editor" className="block p-8 h-full">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-neutral-950 border border-neutral-800 transition-colors duration-300", color)}>
                <Icon className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
            <p className="text-neutral-400 leading-relaxed">{desc}</p>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                <span>Launch Environment</span>
                <ArrowRight className="w-4 h-4" />
            </div>
        </Link>
    </SpotlightButton>
);

const BentoItem = ({ children, className, span = "col-span-1" }: any) => (
    <div className={cn("bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 p-8 rounded-3xl relative overflow-hidden group hover:border-neutral-700 transition-all", span, className)}>
        {children}
    </div>
);

export function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 font-sans">
        
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                        H
                    </div>
                    <span className="font-bold text-lg tracking-tight text-white group-hover:text-blue-100 transition-colors">HOA Code Lab</span>
                </div>
                
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
                    <a href="#" className="hover:text-white transition-colors">Features</a>
                    <a href="#" className="hover:text-white transition-colors">Templates</a>
                    <a href="#" className="hover:text-white transition-colors">Enterprise</a>
                </div>

                <div className="flex items-center gap-4">
                    <Link to="/auth" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors hidden sm:block">Sign In</Link>
                    <Link to="/dashboard/ide" className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95">
                        Open Editor
                    </Link>
                </div>
            </div>
        </nav>

        <main>
            <Hero />

            {/* Quick Start Section */}
            <section className="py-24 relative">
                 <div className="absolute inset-0 bg-neutral-900/20 skew-y-3 transform origin-top-left -z-10" />
                 
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl font-bold mb-4">Start Building <span className="text-neutral-500">Instantly</span></h2>
                            <p className="text-neutral-400 text-lg max-w-xl">
                                Skip the setup. Choose a template and get a live URL in seconds.
                            </p>
                        </div>
                        <button className="text-white border border-neutral-700 px-4 py-2 rounded-full hover:bg-neutral-800 transition-colors flex items-center gap-2 text-sm">
                            View all templates <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <QuickStartCard 
                            icon={Globe}
                            title="Frontend"
                            desc="HTML/CSS/JS sandbox with hot reload. Ideal for quick prototypes."
                            color="bg-orange-500/20 text-orange-500 group-hover:bg-orange-500 group-hover:text-white"
                        />
                         <QuickStartCard 
                            icon={Code2}
                            title="React"
                            desc="Modern React stack with Vite, TypeScript and Tailwind pre-configured."
                            color="bg-blue-500/20 text-blue-500 group-hover:bg-blue-500 group-hover:text-white"
                        />
                         <QuickStartCard 
                            icon={Terminal}
                            title="Node API"
                            desc="Full backend environment with Express.js and direct terminal access."
                            color="bg-green-500/20 text-green-500 group-hover:bg-green-500 group-hover:text-white"
                        />
                         <QuickStartCard 
                            icon={Layers}
                            title="Full Stack"
                            desc="The complete package. React frontend connected to a Node backend."
                            color="bg-purple-500/20 text-purple-500 group-hover:bg-purple-500 group-hover:text-white"
                        />
                    </div>
                </div>
            </section>

            {/* Bento Grid Features */}
             <section className="py-32 bg-[#080808]">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
                            <Zap className="w-3 h-3" />
                            <span>Supercharged Workflow</span>
                        </div>
                        <h2 className="text-5xl font-bold mb-6">More than just an Editor.</h2>
                        <p className="text-xl text-neutral-400">
                            HOA Code Lab brings the power of local development to the cloud, without the hassle.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
                        
                        <BentoItem span="md:col-span-2 md:row-span-2">
                             <div className="absolute top-0 right-0 p-12 opacity-20">
                                <Cpu className="w-64 h-64 text-blue-500" />
                             </div>
                             <div className="relative z-10 h-full flex flex-col justify-between">
                                 <div>
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6">
                                        <Cpu className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4">WebContainers™ Technology</h3>
                                    <p className="text-neutral-400 text-lg leading-relaxed max-w-md">
                                        Execute Node.js commands directly in your browser tab. No remote servers, no latency.
                                        It's secure, incredibly fast, and works offline.
                                    </p>
                                 </div>
                                 <div className="mt-8 bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-sm text-green-400">
                                     $ npm install express<br/>
                                     <span className="text-neutral-500">added 57 packages in 1s</span><br/>
                                     $ node server.js<br/>
                                     <span className="text-white">Server running at http://localhost:3000</span>
                                 </div>
                             </div>
                        </BentoItem>

                        <BentoItem>
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                                <GitBranch className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Collaboration Ready</h3>
                            <p className="text-neutral-400">Pair program with your team in real-time. Share a URL and start coding together instantly.</p>
                        </BentoItem>

                        <BentoItem className="bg-gradient-to-br from-neutral-900 to-neutral-950">
                            <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center mb-6">
                                <Globe className="w-6 h-6 text-pink-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Deploy with One Click</h3>
                            <p className="text-neutral-400">Ship your projects to production effortlessly. Integrates with Vercel and Netlify.</p>
                        </BentoItem>

                    </div>
                </div>
            </section>

             {/* CTA Section */}
             <section className="py-24 border-t border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/5" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl font-bold mb-8">Ready to code?</h2>
                    <Link 
                        to="/editor" 
                        className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-lg font-bold text-black shadow-xl transition-transform hover:scale-105"
                    >
                        Start Building for Free
                    </Link>
                </div>
             </section>

        </main>
        
        <footer className="border-t border-neutral-800 py-12 bg-[#020202]">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-neutral-500 text-sm">
                <p>&copy; 2026 HOA Code Lab. Built for builders.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    <a href="#" className="hover:text-white transition-colors">GitHub</a>
                </div>
            </div>
        </footer>
    </div>
  );
}