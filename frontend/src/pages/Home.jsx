import React, { useEffect, useState } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, Layers, Zap, Globe, ArrowRight, LayoutDashboard, Eye, Heart, Star, Trophy, Clock } from 'lucide-react';
import Button from '../components/UI/Button';
import useEditorStore from '../store/editorStore';
import penService from '../services/pen.service';

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="bg-white dark:bg-[#1e1e1e] p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/50 dark:shadow-none hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
  >
    <div className="mb-6 w-14 h-14 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-600 dark:text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);

const ProjectCard = ({ pen, index, type }) => {
  // Only strip scripts with relative paths that cause 404s, keep CDN and inline scripts
  const cleanHtml = pen?.html ? pen.html.replace(/<script\b[^>]*src=["'](?!(http|https|\/\/))[^"']*["'][^>]*><\/script>/gim, "") : "";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group glass-card rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all"
    >
       <div className="h-48 bg-white relative overflow-hidden pointer-events-none border-b border-gray-100 dark:border-gray-800">
          {/* High-Resolution Virtual Viewport */}
          <div className="absolute top-0 left-0 w-[1280px] h-[800px] origin-top-left" style={{ transform: 'scale(0.3125)' }}>
            <iframe 
              srcDoc={`
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="UTF-8">
                    <style>
                      * { box-sizing: border-box; }
                      body { 
                        margin: 0; 
                        padding: 0; 
                        font-family: sans-serif;
                        overflow: hidden;
                        width: 1280px;
                        height: 800px;
                        background: white;
                      }
                      ${pen?.css || ''} 
                    </style>
                  </head>
                  <body>
                    ${cleanHtml}
                    <script>
                      try { ${pen?.js || ''} } catch(e) {}
                    </script>
                  </body>
                </html>
              `}
              className="w-full h-full border-none"
              tabIndex="-1"
              title={pen?.title || "Project"}
              scrolling="no"
            />
          </div>
          <div className={`absolute inset-0 transition-colors ${type === 'best' ? 'group-hover:bg-yellow-500/5' : 'group-hover:bg-blue-500/5'}`}></div>
          {type === 'best' && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-500 text-white rounded-lg text-[10px] font-black uppercase flex items-center gap-1 shadow-lg shadow-yellow-500/20">
              <Star size={10} className="fill-current" /> Top Project
            </div>
          )}
       </div>
       <div className="p-6">
          <Link to="/editor" className="block group-hover:text-blue-500 transition-colors">
             <h3 className="font-bold text-lg mb-1 truncate">{pen?.title || "Untitled"}</h3>
          </Link>
          <div className="flex items-center gap-2 mb-4">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${pen?.username || 'user'}`} className="w-4 h-4 rounded-full bg-slate-100 border border-gray-200 dark:border-gray-700" alt="user"/>
             <span className="text-xs text-gray-500">{pen?.username || 'anonymous'}</span>
          </div>
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
             <span className="text-xs text-gray-400 flex items-center gap-1.5"><Eye size={14}/> {pen?.views || 0}</span>
             <span className="text-xs text-gray-400 flex items-center gap-1.5"><Heart size={14}/> {pen?.likes || 0}</span>
          </div>
       </div>
    </motion.div>
  );
};

const Home = () => {
  const { user, siteSettings } = useEditorStore();
  const [recentPens, setRecentPens] = useState([]);
  const [topRatedPens, setTopRatedPens] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [codeSnippet, setCodeSnippet] = useState('');

  const phrases = ["discover code.", "create magic.", "share projects.", "build fast."];
  const fullCode = 'const animate = () => {\n  return "World-Class UI";\n};\n\n// Start Building...';

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];
      setDisplayText(isDeleting ? fullText.substring(0, displayText.length - 1) : fullText.substring(0, displayText.length + 1));
      setTypingSpeed(isDeleting ? 100 : 150);
      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };
    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, typingSpeed]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setCodeSnippet(fullCode.substring(0, index));
      index++;
      if (index > fullCode.length) setTimeout(() => { index = 0; }, 2000);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recent, top] = await Promise.all([penService.getPublicPens(), penService.getTopRatedPens()]);
        setRecentPens(recent);
        setTopRatedPens(top);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#060606] text-slate-900 dark:text-white transition-colors duration-300">
      <Header />
      <main className="flex-1 pt-16">
        <section className="relative px-6 py-20 md:py-32 flex flex-col items-center text-center overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/30 rounded-full blur-[100px] animate-blob"></div>
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/30 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
             <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-pink-500/30 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
           </div>
           
           <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-8xl font-black tracking-tight mb-6 relative z-10 h-[2.2em] md:h-auto">
             {siteSettings?.hero_title || "Build, test, and"} <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">{displayText}</span>
             <span className="inline-block w-2 md:w-4 h-[0.8em] bg-blue-500 ml-2 animate-pulse align-middle"></span>
           </motion.h1>
           
           <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-xl text-slate-600 dark:text-gray-400 max-w-2xl mb-10 relative z-10">
             {siteSettings?.hero_subtitle || "The best online code editor for developers of any skill, and particularly empowering for people learning to code."}
           </motion.p>
           
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 relative z-10">
             {user ? (
               <Link to={`/dashboard/${user.role}`}>
                 <Button variant="primary" size="lg" className="w-full sm:w-auto"><LayoutDashboard className="mr-2" size={20}/>Dashboard</Button>
               </Link>
             ) : (
               <Link to="/signup"><Button variant="primary" size="lg" className="w-full sm:w-auto">Sign Up for Free</Button></Link>
             )}
             <Link to={user ? `/dashboard/${user.role}/editor` : "/editor"}><Button variant="secondary" size="lg" className="w-full sm:w-auto">Try the Editor</Button></Link>
           </motion.div>
           
           <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.6 }} className="mt-24 relative w-full max-w-6xl aspect-video glass-card rounded-3xl shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)] overflow-hidden group border border-white/20 dark:border-white/5">
              <div className="absolute top-0 left-0 right-0 h-12 bg-slate-100/80 dark:bg-[#1e293b]/80 backdrop-blur-md flex items-center px-6 gap-2 border-b border-gray-200 dark:border-gray-800 z-10">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-500/80 shadow-inner"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80 shadow-inner"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-green-500/80 shadow-inner"></div>
                </div>
                <div className="flex-1 text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 font-mono">Live Collaborative Workspace</div>
              </div>
              <div className="flex h-full pt-12 relative z-10">
                 <div className="w-1/2 p-10 font-mono text-left text-sm md:text-lg text-slate-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-[#020617]/50 backdrop-blur-sm relative">
                    <div className="absolute top-4 right-4 text-blue-500/20"><Code size={80}/></div>
                    <p className="mb-2"><span className="text-purple-500 font-bold">import</span> {'{ animate }'} <span className="text-purple-500 font-bold">from</span> <span className="text-green-500">"magic"</span>;</p>
                    <div className="text-slate-800 dark:text-blue-400">
                       <pre className="whitespace-pre-wrap leading-relaxed">{codeSnippet}<span className="inline-block w-2.5 h-6 bg-blue-500 ml-1 animate-pulse align-middle"></span></pre>
                    </div>
                 </div>
                 <div className="w-1/2 bg-slate-50/30 dark:bg-white/[0.02] flex flex-col items-center justify-center relative overflow-hidden">
                    <motion.div animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0] }} transition={{ duration: 4, repeat: Infinity }} className="relative z-10 flex flex-col items-center">
                       <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center mb-8 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                          <Zap size={48} className="text-white fill-white animate-pulse" />
                       </div>
                       <div className="text-center">
                          <h4 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 dark:from-white dark:to-slate-400">Build The Future</h4>
                          <div className="flex items-center justify-center gap-2">
                             <div className="h-[1px] w-8 bg-blue-500/50"></div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Live Rendered</span>
                             <div className="h-[1px] w-8 bg-blue-500/50"></div>
                          </div>
                       </div>
                    </motion.div>
                 </div>
              </div>
           </motion.div>
        </section>

        <section className="px-6 py-32 bg-slate-50 dark:bg-[#0f0f0f] border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto">
             <div className="text-center mb-20">
               <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl font-bold mb-4">Everything you need to build</motion.h2>
               <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-xl text-slate-600 dark:text-gray-400">A complete environment for front-end development.</motion.p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <FeatureCard icon={<Code className="text-blue-500" size={32} />} title="Complete Editor" description="HTML, CSS, and JavaScript editors with syntax highlighting and autocomplete." delay={0} />
               <FeatureCard icon={<Zap className="text-yellow-500" size={32} />} title="Instant Preview" description="See your changes update in real-time as you type. No reload needed." delay={0.1} />
               <FeatureCard icon={<Globe className="text-green-500" size={32} />} title="Share Anywhere" description="Show off your work with a link. Embed it on other websites easily." delay={0.2} />
               <FeatureCard icon={<Layers className="text-purple-500" size={32} />} title="Asset Hosting" description="Upload images and assets to use directly in your projects." delay={0.3} />
             </div>
          </div>
        </section>
        
        {!loading && topRatedPens.length > 0 && (
          <section className="px-6 py-24 bg-slate-50 dark:bg-[#020617] border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto">
               <div className="flex items-center gap-3 mb-12">
                  <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500"><Trophy size={32} /></div>
                  <div>
                    <h2 className="text-4xl font-black">Top Rated Projects</h2>
                    <p className="text-slate-500 dark:text-gray-400">The most loved and viewed projects in the community.</p>
                  </div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {topRatedPens.map((pen, i) => <ProjectCard key={pen.id} pen={pen} index={i} type="best" />)}
               </div>
            </div>
          </section>
        )}

        {!loading && recentPens.length > 0 && (
          <section className="px-6 py-24 bg-white dark:bg-[#060606]">
            <div className="max-w-7xl mx-auto">
               <div className="flex items-center gap-3 mb-12">
                  <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500"><Clock size={32} /></div>
                  <div>
                    <h2 className="text-4xl font-black">Recently Built</h2>
                    <p className="text-slate-500 dark:text-gray-400">Fresh code snippets straight from the editor.</p>
                  </div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {recentPens.map((pen, i) => <ProjectCard key={pen.id} pen={pen} index={i} type="recent" />)}
               </div>
            </div>
          </section>
        )}

        <section className="py-24 px-6 bg-gradient-to-r from-blue-600 to-purple-700 text-white text-center">
          <div className="max-w-3xl mx-auto">
             <h2 className="text-4xl font-bold mb-6">Ready to start building?</h2>
             <p className="text-xl text-blue-100 mb-10">Join millions of developers and start your coding journey today.</p>
             {user ? (
                <Link to={`/dashboard/${user.role}`}>
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 shadow-xl shadow-blue-900/20 border-none">Go to Dashboard <ArrowRight className="ml-2" size={20}/></Button>
                </Link>
             ) : (
                <Link to="/signup"><Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 shadow-xl shadow-blue-900/20 border-none">Create Free Account <ArrowRight className="ml-2" size={20}/></Button></Link>
             )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
