import { useEffect, useRef } from "react";
import { Edit2, Trash2, Copy, Scissors, ExternalLink } from "lucide-react";
import { cn } from "../../lib/utils";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function ContextMenu({ x, y, onClose, onRename, onDelete }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Adjust position if menu goes off screen
  const adjustedX = Math.min(x, window.innerWidth - 160);
  const adjustedY = Math.min(y, window.innerHeight - 200);

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] w-48 bg-[#1e1e1e] border border-[#2b2b2b] rounded-md shadow-2xl py-1 animate-in fade-in zoom-in duration-100"
      style={{ left: adjustedX, top: adjustedY }}
    >
      <ContextMenuItem icon={Edit2} label="Rename" shortcut="Enter" onClick={() => { onRename(); onClose(); }} />
      <ContextMenuItem icon={Trash2} label="Delete" shortcut="Del" onClick={() => { onDelete(); onClose(); }} className="text-red-400 hover:text-red-400 hover:bg-red-500/10" />
      
      <div className="h-[1px] bg-[#2b2b2b] my-1 mx-1" />
      
      <ContextMenuItem icon={Copy} label="Copy" shortcut="Ctrl+C" onClick={onClose} />
      <ContextMenuItem icon={Scissors} label="Cut" shortcut="Ctrl+X" onClick={onClose} />
      <ContextMenuItem icon={ExternalLink} label="Open in Preview" onClick={onClose} />
    </div>
  );
}

function ContextMenuItem({ icon: Icon, label, shortcut, onClick, className }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-3 py-1.5 text-xs text-[#cccccc] hover:bg-[#007fd4] hover:text-white transition-colors",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5" />
        <span>{label}</span>
      </div>
      {shortcut && <span className="text-[#71717a] group-hover:text-white/70 ml-4">{shortcut}</span>}
    </button>
  );
}
