import { Panel, Group, Separator } from "react-resizable-panels";
import type { ReactNode } from "react";

interface LayoutProps {
  header?: ReactNode;
  sidebar?: ReactNode;
  editor?: ReactNode;
  preview?: ReactNode;
  terminal?: ReactNode;
}

export function Layout({ header, sidebar, editor, preview, terminal }: LayoutProps) {
  return (
    <div className="h-screen w-full bg-neutral-950 text-white overflow-hidden flex flex-col">
      {/* Header */}
      <header className="h-12 border-b border-neutral-800 flex items-center px-4 shrink-0">
        {header || (
             <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">HOA Code Lab</span>
        )}
      </header>

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden">
        <Group orientation="horizontal">
          {/* Sidebar */}
          <Panel defaultSize={15} minSize={10} maxSize={25} className="bg-neutral-900 border-r border-neutral-800">
            {sidebar || <div className="p-4 text-neutral-500 text-sm">File Tree</div>}
          </Panel>
          
          <Separator className="w-1 bg-neutral-800 hover:bg-blue-500 transition-colors cursor-col-resize" />
          
          {/* Center Content (Editor + Preview/Terminal) */}
          <Panel>
             <Group orientation="vertical">
                {/* Editor & Preview Area */}
                <Panel defaultSize={70}>
                    <Group orientation="horizontal">
                        <Panel defaultSize={50} minSize={20}>
                            {editor || <div className="h-full w-full flex items-center justify-center text-neutral-600">Editor</div>}
                        </Panel>
                        <Separator className="w-1 bg-neutral-800 hover:bg-blue-500 transition-colors cursor-col-resize" />
                        <Panel defaultSize={50} minSize={20} className="bg-white">
                            {preview || <iframe className="w-full h-full border-none" title="Preview" />}
                        </Panel>
                    </Group>
                </Panel>
                
                <Separator className="h-1 bg-neutral-800 hover:bg-blue-500 transition-colors cursor-row-resize" />
                
                {/* Terminal Area */}
                <Panel defaultSize={30} minSize={10} className="bg-neutral-900">
                     {terminal || <div className="p-4 text-green-500 font-mono text-sm">$ Terminal ready...</div>}
                </Panel>
             </Group>
          </Panel>
        </Group>
      </div>
    </div>
  );
}
