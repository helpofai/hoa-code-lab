import { create } from 'zustand';
import authService from '../services/auth.service';
import settingsService from '../services/settings.service';

const useEditorStore = create((set) => ({
  html: '<h1>Hello CodePen</h1>',
  css: 'h1 { color: red; }',
  js: 'console.log("Hello from CodePen Clone");',
  title: 'Untitled Pen',
  activePenId: null,
  user: authService.getCurrentUser(),
  theme: localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
  toasts: [],
  siteSettings: null,
  
  setHtml: (html) => set({ html }),
  setCss: (css) => set({ css }),
  setJs: (js) => set({ js }),
  setTitle: (title) => set({ title }),
  setActivePenId: (id) => set({ activePenId: id }),
  setUser: (user) => set({ user }),
  
  fetchSiteSettings: async () => {
    try {
      const data = await settingsService.getSettings();
      set({ siteSettings: data });
      // Apply CSS variables globally
      document.documentElement.style.setProperty('--accent', data.accent_color);
      document.documentElement.style.setProperty('--success', data.success_color);
      document.documentElement.style.setProperty('--danger', data.danger_color);
    } catch (e) { console.error(e); }
  },
    addToast: (toast) => set((state) => ({ 
      toasts: [...state.toasts, { id: Date.now(), ...toast }] 
    })),
    
    removeToast: (id) => set((state) => ({ 
      toasts: state.toasts.filter(t => t.id !== id) 
    })),
  
  
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },
  
  logout: () => {
    authService.logout();
    set({ user: null });
  },

  resetCode: () => set({
    html: '<h1>Hello CodePen</h1>',
    css: 'h1 { color: red; }',
    js: 'console.log("Hello from CodePen Clone");',
    title: 'Untitled Pen',
    activePenId: null,
  }),
}));

export default useEditorStore;
