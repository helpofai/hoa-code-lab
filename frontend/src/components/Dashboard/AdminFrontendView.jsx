import React, { useState } from 'react';
import { Layout, Palette, Type, Image as ImageIcon, Save, CheckCircle, Code, Info, Github, Twitter, Youtube, Globe } from 'lucide-react';
import Button from '../UI/Button';
import { motion } from 'framer-motion';
import useEditorStore from '../../store/editorStore';
import settingsService from '../../services/settings.service';

const AdminFrontendView = () => {
  const { siteSettings, fetchSiteSettings } = useEditorStore();
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('landing');
  
  const [formData, setFormData] = useState(siteSettings || {});

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await settingsService.updateSettings(formData);
      await fetchSiteSettings(); // Refresh global state
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (e) {
      alert("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black mb-2 text-red-500">Frontend Configuration</h1>
          <p className="text-slate-500 dark:text-gray-400">Customize the landing page and global UI elements.</p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving} variant="primary">
           {showSuccess ? <><CheckCircle size={18} className="mr-2"/> Saved</> : <><Save size={18} className="mr-2"/> Save Changes</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation */}
        <div className="md:col-span-1 space-y-2">
           <SubTabButton 
             label="Landing Page" 
             icon={<Layout size={18}/>} 
             active={activeSubTab === 'landing'} 
             onClick={() => setActiveSubTab('landing')} 
           />
           <SubTabButton 
             label="Branding & Colors" 
             icon={<Palette size={18}/>} 
             active={activeSubTab === 'branding'} 
             onClick={() => setActiveSubTab('branding')} 
           />
           <SubTabButton 
             label="Editor Interface" 
             icon={<Code size={18}/>} 
             active={activeSubTab === 'editor'} 
             onClick={() => setActiveSubTab('editor')} 
           />
           <SubTabButton 
             label="Footer" 
             icon={<Info size={18}/>} 
             active={activeSubTab === 'footer'} 
             onClick={() => setActiveSubTab('footer')} 
           />
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-8">
           {activeSubTab === 'landing' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="glass-card p-8 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-6">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Layout size={20} className="text-blue-500"/> Hero Section
                  </h3>
                  <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Main Heading</label>
                        <textarea className="w-full p-4 bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-lg font-bold" rows="2" defaultValue="Build, test, and discover code." />
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Sub-heading Text</label>
                        <textarea className="w-full p-4 bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-500" rows="3" defaultValue="The best online code editor for developers of any skill..." />
                    </div>
                  </div>
                </div>
             </motion.div>
           )}

           {activeSubTab === 'branding' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* Visual Assets */}
                <div className="glass-card p-8 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-6">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Palette size={20} className="text-green-500"/> Site Identity
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <AssetUpload label="Main Logo (Dark)" />
                    <AssetUpload label="Main Logo (Light)" />
                  </div>
                </div>

                {/* Color Palette */}
                <div className="glass-card p-8 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-8">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Color Palette</h3>
                    <p className="text-sm text-gray-500">Define the primary colors for your platform.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                       <ColorInput label="Accent Color" defaultValue="#3b82f6" />
                       <ColorInput label="Success Color" defaultValue="#47cf73" />
                       <ColorInput label="Danger Color" defaultValue="#ef4444" />
                       
                       <div className="pt-4">
                          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Theme Presets</label>
                          <div className="flex gap-3">
                             <PresetCircle color="bg-blue-500" active />
                             <PresetCircle color="bg-purple-500" />
                             <PresetCircle color="bg-emerald-500" />
                             <PresetCircle color="bg-orange-500" />
                             <PresetCircle color="bg-pink-500" />
                          </div>
                       </div>
                    </div>

                    {/* Preview Mockup */}
                    <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 flex flex-col gap-4">
                       <div className="flex items-center justify-between mb-2">
                          <div className="w-12 h-2 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                          <div className="flex gap-2">
                             <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                             <div className="w-4 h-4 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <div className="w-full h-8 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 flex items-center px-3">
                             <div className="w-1/2 h-2 bg-blue-500/20 rounded-full"></div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                             <div className="h-12 bg-white dark:bg-slate-900 rounded-lg border border-gray-100 dark:border-gray-800"></div>
                             <div className="h-12 bg-white dark:bg-slate-900 rounded-lg border border-gray-100 dark:border-gray-800"></div>
                             <div className="h-12 bg-blue-500 rounded-lg"></div>
                          </div>
                       </div>
                       <div className="text-[10px] text-center font-bold text-gray-400 uppercase tracking-widest mt-2">Live Preview Mockup</div>
                    </div>
                  </div>
                </div>
             </motion.div>
           )}

           {activeSubTab === 'editor' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="glass-card p-8 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-6">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Code size={20} className="text-purple-500"/> Editor Configuration
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <ConfigField label="Default Theme" type="select" options={['VS Dark', 'Light', 'Monokai']} />
                    <ConfigField label="Font Family" type="text" defaultValue="'Fira Code', monospace" />
                    <ConfigField label="Default Font Size" type="number" defaultValue="14" />
                    <ConfigField label="Tab Size" type="select" options={['2 Spaces', '4 Spaces']} />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <input type="checkbox" id="lineNumbers" defaultChecked className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <label htmlFor="lineNumbers" className="text-sm font-medium text-slate-600 dark:text-gray-400">Show Line Numbers by Default</label>
                  </div>
                </div>
             </motion.div>
           )}

           {activeSubTab === 'footer' && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="glass-card p-8 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-6">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Info size={20} className="text-blue-500"/> Footer Content
                  </h3>
                  <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Copyright Text</label>
                        <input className="w-full p-3 bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl outline-none" defaultValue={`© ${new Date().getFullYear()} CodePen Clone. All rights reserved.`} />
                    </div>
                  </div>
                </div>

                <div className="glass-card p-8 rounded-3xl border border-gray-200 dark:border-gray-800 space-y-6">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Globe size={20} className="text-purple-500"/> Social Media Links
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <SocialInput icon={<Github size={18}/>} label="GitHub" defaultValue="https://github.com/..." />
                    <SocialInput icon={<Twitter size={18}/>} label="Twitter" defaultValue="https://twitter.com/..." />
                    <SocialInput icon={<Youtube size={18}/>} label="YouTube" defaultValue="https://youtube.com/..." />
                  </div>
                </div>
             </motion.div>
           )}
        </div>
      </div>
    </div>
  );
};

const SubTabButton = ({ label, icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
      active 
        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
        : 'text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5'
    }`}
  >
    {icon} {label}
  </button>
);

const AssetUpload = ({ label }) => (
  <div className="p-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center gap-3 group hover:border-blue-500 transition-colors cursor-pointer">
    <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-full text-gray-400 group-hover:text-blue-500 transition-colors">
      <ImageIcon size={24}/>
    </div>
    <span className="text-xs font-bold text-gray-500">{label}</span>
  </div>
);

const ConfigField = ({ label, type, defaultValue, options }) => (
  <div>
    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">{label}</label>
    {type === 'select' ? (
      <select className="w-full p-3 bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl outline-none">
        {options.map(opt => <option key={opt}>{opt}</option>)}
      </select>
    ) : (
      <input type={type} className="w-full p-3 bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl outline-none" defaultValue={defaultValue} />
    )}
  </div>
);

const ColorInput = ({ label, defaultValue }) => (
  <div className="flex items-center justify-between group">
    <label className="text-sm font-bold text-slate-600 dark:text-gray-400">{label}</label>
    <div className="flex items-center gap-3">
       <span className="text-xs font-mono text-gray-400 group-hover:text-blue-500 transition-colors uppercase">{defaultValue}</span>
       <input 
         type="color" 
         defaultValue={defaultValue} 
         className="w-10 h-10 rounded-lg border-none bg-transparent cursor-pointer overflow-hidden p-0"
       />
    </div>
  </div>
);

const PresetCircle = ({ color, active }) => (
  <button className={`w-8 h-8 rounded-full ${color} ${active ? 'ring-4 ring-blue-500/20 scale-110' : 'hover:scale-110'} transition-all`}></button>
);

const SocialInput = ({ icon, label, defaultValue }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
      <input type="text" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl outline-none text-sm focus:border-blue-500 transition-colors" defaultValue={defaultValue} />
    </div>
  </div>
);

export default AdminFrontendView;
  