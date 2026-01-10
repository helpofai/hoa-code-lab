import { GitBranch, AlertCircle, Bell, RefreshCcw } from "lucide-react";
import { useCodeStore } from "../../store/useCodeStore";

export function StatusBar() {
  const { activeFileName } = useCodeStore();

  return (
    <div className="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-[11px] select-none shrink-0 z-40 font-sans">
      <div className="flex items-center h-full">
        <button className="flex items-center gap-1.5 hover:bg-white/10 px-2 h-full transition-colors border-r border-white/5 mr-1">
          <GitBranch className="w-3 h-3" />
          <span>main*</span>
        </button>
        
        <button className="flex items-center gap-1.5 hover:bg-white/10 px-2 h-full transition-colors border-r border-white/5">
            <RefreshCcw className="w-3 h-3" />
            <span>Sync</span>
        </button>

        <button className="flex items-center gap-1 hover:bg-white/10 px-2 h-full transition-colors">
            <AlertCircle className="w-3 h-3" />
            <span>0</span>
            <AlertCircle className="w-3 h-3 ml-1 rotate-180" />
            <span>0</span>
        </button>
      </div>

      <div className="flex items-center h-full">
        {activeFileName && (
            <div className="flex items-center h-full mr-2">
                <button className="hover:bg-white/10 px-3 h-full transition-colors">Ln 1, Col 1</button>
                <button className="hover:bg-white/10 px-3 h-full transition-colors">Spaces: 2</button>
                <button className="hover:bg-white/10 px-3 h-full transition-colors uppercase">{activeFileName.split('.').pop() || 'Text'}</button>
            </div>
        )}
        <button className="hover:bg-white/10 px-3 h-full transition-colors">UTF-8</button>
        <button className="hover:bg-white/10 px-3 h-full transition-colors">
            <Bell className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}