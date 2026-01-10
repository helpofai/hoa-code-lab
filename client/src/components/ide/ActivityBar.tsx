import { Files, Search, GitBranch, Puzzle, Settings, Github, Globe } from "lucide-react";
import { cn } from "../../lib/utils";

interface ActivityBarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export function ActivityBar({ activeView, setActiveView }: ActivityBarProps) {
  const items = [
    { id: "explorer", icon: Files, label: "Explorer" },
    { id: "search", icon: Search, label: "Search" },
    { id: "git", icon: GitBranch, label: "Source Control" },
    { id: "network", icon: Globe, label: "Network & Domains" },
    { id: "extensions", icon: Puzzle, label: "Extensions" },
  ];

  return (
    <div className="w-12 h-full bg-[#18181b] border-r border-[#27272a] flex flex-col items-center py-2 shrink-0 z-30">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveView(item.id)}
          className={cn(
            "w-12 h-12 flex items-center justify-center text-[#71717a] hover:text-white transition-colors relative",
            activeView === item.id && "text-white"
          )}
          title={item.label}
        >
          {activeView === item.id && (
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#3b82f6]" />
          )}
          <item.icon className="w-6 h-6" />
        </button>
      ))}

      <div className="mt-auto flex flex-col items-center">
         <button 
            onClick={() => setActiveView("github")}
            className={cn(
                "w-12 h-12 flex items-center justify-center text-[#71717a] hover:text-white transition-colors relative",
                activeView === "github" && "text-white"
            )}
            title="GitHub Account"
         >
            {activeView === "github" && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#3b82f6]" />
            )}
            <Github className="w-6 h-6" />
         </button>
         <button className="w-12 h-12 flex items-center justify-center text-[#71717a] hover:text-white transition-colors">
            <Settings className="w-6 h-6" />
         </button>
      </div>
    </div>
  );
}
