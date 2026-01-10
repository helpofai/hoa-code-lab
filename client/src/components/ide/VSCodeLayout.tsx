import { useState, type ReactNode } from "react";
import { Panel, Group, Separator } from "react-resizable-panels";
import { ActivityBar } from "./ActivityBar";
import { StatusBar } from "./StatusBar";
import { Sidebar } from "./Sidebar";
import { EditorTabs } from "./EditorTabs";
import { SearchPanel } from "./SearchPanel";
import { GithubSettingsPanel } from "./GithubSettingsPanel";
import { GitPanel } from "./GitPanel";
import { NetworkPanel } from "./NetworkPanel";

interface VSCodeLayoutProps {
  sidebarContent: ReactNode;
  editor: ReactNode;
  terminal: ReactNode;
  preview: ReactNode;
  previewUrl: string | null;
}

export function VSCodeLayout({ sidebarContent, editor, terminal, preview, previewUrl }: VSCodeLayoutProps) {
  const [activeView, setActiveView] = useState("explorer");

  return (
    <div className="h-screen w-full bg-[#1e1e1e] flex flex-col overflow-hidden text-[#cccccc] font-sans">
      
      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <ActivityBar activeView={activeView} setActiveView={setActiveView} />

        {/* Fixed Sidebar (No longer resizable) */}
        {activeView === "explorer" && (
            <div className="w-64 bg-[#18181b] border-r border-[#2b2b2b] shrink-0">
                <Sidebar title="Explorer">
                    {sidebarContent}
                </Sidebar>
            </div>
        )}

        {activeView === "search" && (
            <div className="w-64 bg-[#18181b] border-r border-[#2b2b2b] shrink-0">
                <SearchPanel />
            </div>
        )}

        {activeView === "github" && (
            <div className="w-64 bg-[#18181b] border-r border-[#2b2b2b] shrink-0">
                <GithubSettingsPanel />
            </div>
        )}

        {activeView === "git" && (
            <div className="w-64 bg-[#18181b] border-r border-[#2b2b2b] shrink-0">
                <GitPanel />
            </div>
        )}

        {activeView === "network" && (
            <div className="w-64 bg-[#18181b] border-r border-[#2b2b2b] shrink-0">
                <NetworkPanel previewUrl={previewUrl} />
            </div>
        )}


        {/* Main Resizable Area (Editor + Terminal + Preview) */}
        <div className="flex-1 overflow-hidden">
            <Group orientation="vertical">
                {/* Top: Editor & Preview */}
                <Panel defaultSize={75}>
                    <Group orientation="horizontal">
                        <Panel defaultSize={60} minSize={30}>
                            <div className="h-full flex flex-col">
                                <EditorTabs />
                                <div className="flex-1 overflow-hidden relative">
                                    {editor}
                                </div>
                            </div>
                        </Panel>
                        
                        <Separator className="w-[1px] bg-[#2b2b2b] hover:bg-[#007fd4] transition-colors" />
                        
                        <Panel defaultSize={40} minSize={20} className="bg-white">
                            {preview}
                        </Panel>
                    </Group>
                </Panel>
                
                <Separator className="h-[1px] bg-[#2b2b2b] hover:bg-[#007fd4] transition-colors" />
                
                {/* Bottom: Terminal */}
                <Panel defaultSize={25} minSize={10} className="bg-[#18181b]">
                    <div className="h-full flex flex-col text-white">
                        <div className="h-8 border-b border-[#2b2b2b] px-4 flex items-center gap-4 text-xs uppercase tracking-wide">
                            <span className="border-b border-[#e7e7e7] pb-1 text-[#e7e7e7]">Terminal</span>
                            <span className="text-[#8b949e] hover:text-[#e7e7e7] cursor-pointer">Output</span>
                            <span className="text-[#8b949e] hover:text-[#e7e7e7] cursor-pointer">Problems</span>
                        </div>
                        <div className="flex-1">
                            {terminal}
                        </div>
                    </div>
                </Panel>
            </Group>
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}