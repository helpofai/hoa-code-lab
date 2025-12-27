import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { Copy, Check } from 'lucide-react';

const EmbedModal = ({ isOpen, onClose, penId, title, user }) => {
  const [copied, setCopied] = useState(false);

  // Construct the embed URL (pointing to a dedicated embed route we'll create)
  const embedUrl = `${window.location.origin}/embed/${penId}`;
  
  const embedCode = `<iframe 
  src="${embedUrl}" 
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" 
  title="${title}" 
  allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" 
  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Embed This Pen">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
            Embed Code
          </label>
          <div className="relative">
            <textarea 
              readOnly 
              value={embedCode}
              className="w-full h-32 p-3 bg-slate-100 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg font-mono text-xs text-gray-600 dark:text-gray-400 resize-none focus:outline-none"
            />
            <button 
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-md hover:text-blue-500 transition-colors shadow-sm"
              title="Copy to clipboard"
            >
              {copied ? <Check size={16} className="text-green-500"/> : <Copy size={16}/>}
            </button>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30">
           <h4 className="font-bold text-sm text-blue-700 dark:text-blue-400 mb-1">Preview</h4>
           <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
             This is how your pen will look when embedded on other sites.
           </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} variant="secondary">Done</Button>
        </div>
      </div>
    </Modal>
  );
};

export default EmbedModal;
