import type { ReactNode } from "react";

interface SidebarProps {
  title: string;
  children: ReactNode;
}

export function Sidebar({ title, children }: SidebarProps) {
  return (
    <div className="h-full flex flex-col bg-[#18181b] text-[#cccccc]">
      <div className="h-9 px-4 flex items-center text-xs font-bold uppercase tracking-wider text-[#bbbbbb]">
        {title}
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
