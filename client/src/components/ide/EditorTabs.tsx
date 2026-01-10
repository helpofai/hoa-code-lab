import { X } from "lucide-react";
import { useCodeStore } from "../../store/useCodeStore";
import { cn } from "../../lib/utils";

export function EditorTabs() {
  const { openFiles, activeFileName, setActiveFile, closeFile } = useCodeStore();

  return (
    <div className="flex items-center bg-[#18181b] overflow-x-auto h-9 border-b border-[#27272a] no-scrollbar">
      {openFiles.map((fileName) => (
        <div
          key={fileName}
          className={cn(
            "group flex items-center gap-2 px-3 py-2 text-sm min-w-[120px] max-w-[200px] border-r border-[#27272a] cursor-pointer select-none h-full",
            activeFileName === fileName 
                ? "bg-[#1e1e1e] text-white border-t-2 border-t-[#3b82f6]" 
                : "bg-[#27272a] text-[#71717a] hover:bg-[#27272a]/80"
          )}
          onClick={() => setActiveFile(fileName)}
        >
          {/* File Icon (Simple) */}
          <span className="truncate flex-1">{fileName}</span>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeFile(fileName);
            }}
            className={cn(
                "p-0.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-[#3f3f46] transition-all",
                activeFileName === fileName && "opacity-100"
            )}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
