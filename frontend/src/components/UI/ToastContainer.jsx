import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import useEditorStore from '../../store/editorStore';

const ToastContainer = () => {
  const { toasts, removeToast } = useEditorStore();

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-500" size={20}/>;
      case 'warning': return <AlertTriangle className="text-orange-500" size={20}/>;
      case 'error': return <AlertCircle className="text-red-500" size={20}/>;
      default: return <Info className="text-blue-500" size={20}/>;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-4 rounded-2xl shadow-2xl flex items-start gap-4"
          >
            <div className="mt-1">{getIcon(toast.type)}</div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{toast.title}</h4>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{toast.message}</p>
              
              <div className="mt-3 flex items-center gap-2">
                 <button 
                   onClick={() => {
                     if (toast.onAction) toast.onAction();
                     removeToast(toast.id);
                   }}
                   className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors"
                 >
                   {toast.actionLabel || 'Confirm'}
                 </button>
                 <button 
                   onClick={() => removeToast(toast.id)}
                   className="px-3 py-1.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors"
                 >
                   Dismiss
                 </button>
              </div>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
