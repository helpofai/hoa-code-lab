import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Youtube, Instagram, Mail, Globe, ArrowRight } from 'lucide-react';

const Footer = ({ className }) => {
  return (
    <footer className={`bg-white dark:bg-[#020617] border-t border-gray-200 dark:border-gray-800 transition-colors duration-300 pt-20 pb-10 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
        
        {/* Brand Section */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 bg-white dark:bg-black rotate-45"></div>
              </div>
              <h2 className="text-2xl font-black tracking-tighter">CodePen Clone</h2>
           </div>
           <p className="text-slate-500 dark:text-gray-400 max-w-sm leading-relaxed">
             The best place to build, test, and discover front-end code. Join a community of millions of developers and start your journey today.
           </p>
           <div className="flex gap-4">
              <SocialLink icon={<Twitter size={18} />} href="#" />
              <SocialLink icon={<Github size={18} />} href="#" />
              <SocialLink icon={<Youtube size={18} />} href="#" />
              <SocialLink icon={<Instagram size={18} />} href="#" />
           </div>
        </div>

        {/* Links: Product */}
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6">Product</h3>
          <ul className="space-y-4">
            <FooterLink to="/editor">Online Editor</FooterLink>
            <FooterLink to="/pens">Public Pens</FooterLink>
            <FooterLink to="/pro">Pro Features</FooterLink>
            <FooterLink to="/assets">Asset Hosting</FooterLink>
          </ul>
        </div>

        {/* Links: Community */}
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6">Community</h3>
          <ul className="space-y-4">
            <FooterLink to="/challenges">Challenges</FooterLink>
            <FooterLink to="/spark">Spark</FooterLink>
            <FooterLink to="/topics">Topics</FooterLink>
            <FooterLink to="/support">Support Help</FooterLink>
          </ul>
        </div>

        {/* Links: Company */}
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-6">Company</h3>
          <ul className="space-y-4">
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms of Service</FooterLink>
            <FooterLink to="/contact">Contact</FooterLink>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-gray-100 dark:border-gray-900 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-sm text-slate-500 dark:text-gray-500 font-medium">
          &copy; {new Date().getFullYear()} CodePen Clone. All rights reserved.
        </div>
        
        <div className="flex items-center gap-8 text-sm text-slate-500 dark:text-gray-500">
           <div className="flex items-center gap-2 group cursor-pointer">
              <Globe size={16} className="group-hover:text-blue-500 transition-colors"/>
              <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">English (US)</span>
           </div>
           <div className="flex items-center gap-2 group cursor-pointer">
              <Mail size={16} className="group-hover:text-blue-500 transition-colors"/>
              <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Subscribe to Newsletter</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ children, to }) => (
  <li>
    <Link 
      to={to} 
      className="text-sm text-slate-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
    >
      {children}
    </Link>
  </li>
);

const SocialLink = ({ icon, href }) => (
  <a 
    href={href} 
    className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-gray-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500 transition-all shadow-sm"
  >
    {icon}
  </a>
);

export default Footer;
