import { useState, useMemo, useRef, useEffect } from "react";
import { useCodeStore } from "../store/useCodeStore";
import type { FSItem } from "../store/useCodeStore";
import { useWebContainerStore } from "../store/useWebContainerStore";
import { 
  FileCode, 
  FileJson, 
  FileType, 
  Folder, 
  ChevronRight, 
  FilePlus, 
  FolderPlus, 
  Search,
  X,
  Library,
  RotateCw
} from "lucide-react";
import { cn } from "../lib/utils";
import { ContextMenu } from "./ide/ContextMenu";

// --- Tree Logic ---
interface TreeNode extends FSItem {
    children?: Record<string, TreeNode>;
}

const buildTree = (files: Record<string, FSItem>) => {
    const root: Record<string, TreeNode> = {};
    const sortedPaths = Object.keys(files).sort((a, b) => {
        const aDir = a.includes('/');
        const bDir = b.includes('/');
        if (aDir && !bDir) return -1;
        if (!aDir && bDir) return 1;
        return a.localeCompare(b);
    });

    sortedPaths.forEach(path => {
        const file = files[path];
        const parts = path.split('/');
        let current = root;
        parts.forEach((part, index) => {
            if (index === parts.length - 1) {
                current[part] = { ...file, children: current[part]?.children || {} };
            } else {
                if (!current[part]) {
                    current[part] = { name: part, path: parts.slice(0, index + 1).join('/'), type: 'folder', children: {} };
                }
                current = current[part].children!;
            }
        });
    });
    return root;
};

const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.html')) return <FileCode className="text-[#e34c26] w-4 h-4" />;
    if (fileName.endsWith('.css')) return <FileType className="text-[#264de4] w-4 h-4" />;
    if (fileName.endsWith('.js') || fileName.endsWith('.ts')) return <FileJson className="text-[#f7df1e] w-4 h-4" />;
    if (fileName.endsWith('.json')) return <FileJson className="text-[#cbcb41] w-4 h-4" />;
    return <FileCode className="text-[#858585] w-4 h-4" />;
};

export function FileTree() {
  const { files, activeFileName, setActiveFile, openFiles, closeFile, createFile, createFolder, deleteFile, renameFile, setFiles } = useCodeStore();
  const { snapshot, isReady } = useWebContainerStore();
  const [isExplorerOpen, setIsExplorerOpen] = useState(true);
  const [isOpenEditorsOpen, setIsOpenEditorsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [menu, setMenu] = useState<{ x: number, y: number, target: string } | null>(null);
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  const tree = useMemo(() => buildTree(files), [files]);

  const syncFromWebContainer = async () => {
      if (!isReady) return;
      setIsRefreshing(true);
      try {
          const fsSnapshot = await snapshot();
          if (Object.keys(fsSnapshot).length > 0) {
              setFiles(fsSnapshot);
          }
      } catch (err) {
          console.error("Sync failed", err);
      } finally {
          setIsRefreshing(false);
      }
  };

  const handleContextMenu = (e: React.MouseEvent, path: string) => {
      e.preventDefault();
      setMenu({ x: e.clientX, y: e.clientY, target: path });
  };

  const handleRenameSubmit = (oldName: string) => {
      if (newName && newName !== oldName) {
          renameFile(oldName, newName);
      }
      setRenamingFile(null);
      setNewName("");
  };

  return (
    <div className="flex flex-col h-full bg-[#181818] select-none relative font-sans text-[#cccccc]">
        {/* Open Editors */}
        <div className="flex flex-col shrink-0">
            <div className="flex items-center gap-1 px-1 py-1 bg-[#252526] hover:bg-[#2a2d2e] cursor-pointer group border-b border-[#181818]" onClick={() => setIsOpenEditorsOpen(!isOpenEditorsOpen)}>
                <ChevronRight className={cn("w-4 h-4 text-[#858585] transition-transform duration-150", isOpenEditorsOpen && "rotate-90")} />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#bbbbbb] flex-1">Open Editors</span>
            </div>
            {isOpenEditorsOpen && (
                <div className="py-0.5">
                    {openFiles.map(fileName => (
                        <div key={`open-${fileName}`} className={cn("flex items-center gap-2 px-5 py-0.5 text-[13px] group cursor-pointer hover:bg-[#2a2d2e]", activeFileName === fileName ? "text-white bg-[#37373d]" : "text-[#cccccc]")} onClick={() => setActiveFile(fileName)}>
                            {getFileIcon(fileName)}
                            <span className="flex-1 truncate">{fileName}</span>
                            <button onClick={(e) => { e.stopPropagation(); closeFile(fileName); }} className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-[#454545] rounded transition-all"><X className="w-3.5 h-3.5" /></button>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Project Root */}
        <div className="flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between px-1 py-1 bg-[#252526] group border-b border-[#181818]">
                <div className="flex items-center gap-1 cursor-pointer flex-1" onClick={() => setIsExplorerOpen(!isExplorerOpen)}>
                    <ChevronRight className={cn("w-4 h-4 text-[#858585] transition-transform duration-150", isExplorerOpen && "rotate-90")} />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#bbbbbb]">HOA-CODE-LAB</span>
                </div>
                <div className="flex items-center gap-0.5 pr-1">
                    <button onClick={syncFromWebContainer} className={cn("p-1 hover:bg-[#37373d] rounded text-[#858585] hover:text-[#cccccc]", isRefreshing && "animate-spin text-blue-400")} title="Refresh / Sync Filesystem"><RotateCw className="w-3.5 h-3.5" /></button>
                    <button onClick={() => createFile('new-file.js', 'javascript')} className="p-1 hover:bg-[#37373d] rounded text-[#858585] hover:text-[#cccccc]" title="New File"><FilePlus className="w-4 h-4" /></button>
                    <button onClick={() => createFolder('new-folder')} className="p-1 hover:bg-[#37373d] rounded text-[#858585] hover:text-[#cccccc]" title="New Folder"><FolderPlus className="w-4 h-4" /></button>
                    <button onClick={() => setShowSearch(!showSearch)} className="p-1 hover:bg-[#37373d] rounded text-[#858585] hover:text-[#cccccc]" title="Search Files"><Search className="w-4 h-4" /></button>
                    <button className="p-1 hover:bg-[#37373d] rounded text-[#858585] hover:text-[#cccccc]" title="Collapse All Folders"><Library className="w-4 h-4" /></button>
                </div>
            </div>

            {showSearch && (
                <div className="px-3 py-2 bg-[#181818]">
                    <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#3c3c3c] border border-transparent focus:border-[#007fd4] rounded px-2 py-1 text-xs outline-none text-white" placeholder="Filter files..." />
                </div>
            )}

            {isExplorerOpen && (
                <div className="flex-1 overflow-y-auto py-0.5 custom-scrollbar">
                    {Object.values(tree).map(node => (
                        <TreeItemComponent 
                            key={node.path} 
                            node={node} 
                            depth={0} 
                            activeFileName={activeFileName} 
                            onSelect={setActiveFile} 
                            onContextMenu={handleContextMenu}
                            renamingFile={renamingFile}
                            newName={newName}
                            setNewName={setNewName}
                            onRenameSubmit={handleRenameSubmit}
                            searchQuery={searchQuery}
                            createFile={createFile}
                            createFolder={createFolder}
                            deleteFile={deleteFile}
                        />
                    ))}
                </div>
            )}
        </div>

        {menu && (
            <ContextMenu x={menu.x} y={menu.y} onClose={() => setMenu(null)} onRename={() => { setRenamingFile(menu.target); setNewName(menu.target); }} onDelete={() => { if(confirm(`Delete ${menu.target}?`)) deleteFile(menu.target); }} />
        )}
    </div>
  );
}

function TreeItemComponent({ node, depth, activeFileName, onSelect, onContextMenu, renamingFile, newName, setNewName, onRenameSubmit, searchQuery, createFile, createFolder, deleteFile }: any) {
    const [isOpen, setIsOpen] = useState(node.isOpen ?? true);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (renamingFile === node.path && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [renamingFile, node.path]);

    if (searchQuery && node.type === 'file' && !node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return null;
    }

    const paddingLeft = depth * 8 + 12;

    if (node.type === 'file') {
        return (
            <div 
                className={cn("flex items-center gap-1.5 py-[3px] group cursor-pointer border-l-2 transition-all relative pr-2", activeFileName === node.path ? "bg-[#37373d] text-white border-[#007fd4]" : "text-[#cccccc] border-transparent hover:bg-[#2a2d2e]")}
                style={{ paddingLeft: `${paddingLeft}px` }}
                onClick={() => onSelect(node.path)}
                onContextMenu={(e) => onContextMenu(e, node.path)}
            >
                {depth > 0 && Array.from({ length: depth }).map((_, i) => (
                    <div key={i} className="absolute top-0 bottom-0 w-[1px] bg-[#2b2b2b]" style={{ left: `${(i * 8) + 18}px` }} />
                ))}
                {getFileIcon(node.name)}
                {renamingFile === node.path ? (
                    <input ref={inputRef} value={newName} onChange={(e) => setNewName(e.target.value)} onBlur={() => onRenameSubmit(node.path)} onKeyDown={(e) => e.key === 'Enter' && onRenameSubmit(node.path)} className="bg-[#1e1e1e] border border-[#007fd4] rounded px-1 text-[13px] outline-none w-full" />
                ) : (
                    <>
                        <span className="text-[13px] truncate flex-1">{node.name}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); if(confirm(`Delete ${node.name}?`)) deleteFile(node.path); }} className="p-0.5 hover:bg-[#454545] rounded text-[#858585] hover:text-[#f14c4c]"><X className="w-3.5 h-3.5" /></button>
                        </div>
                    </>
                )}
            </div>
        );
    }

    const children = Object.values(node.children || {}).sort((a: any, b: any) => {
        if (a.type === 'folder' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
    });

    return (
        <div>
            <div className="flex items-center gap-1 py-[3px] text-[#cccccc] hover:bg-[#2a2d2e] cursor-pointer group pr-2 relative" style={{ paddingLeft: `${depth * 8 + 4}px` }} onClick={() => setIsOpen(!isOpen)} onContextMenu={(e) => onContextMenu(e, node.path)}>
                {depth > 0 && Array.from({ length: depth }).map((_, i) => (
                    <div key={i} className="absolute top-0 bottom-0 w-[1px] bg-[#2b2b2b]" style={{ left: `${(i * 8) + 18}px` }} />
                ))}
                <ChevronRight className={cn("w-4 h-4 text-[#858585] transition-transform duration-150", isOpen && "rotate-90")} />
                <Folder className="w-4 h-4 text-[#3794ef]" />
                <span className="text-[13px] font-medium flex-1 truncate">{node.name}</span>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); createFile(`${node.path}/new-file.js`, 'javascript'); setIsOpen(true); }} className="p-1 hover:bg-[#454545] rounded text-[#858585] hover:text-[#cccccc]" title="New File"><FilePlus className="w-3.5 h-3.5" /></button>
                    <button onClick={(e) => { e.stopPropagation(); createFolder(`${node.path}/new-folder`); setIsOpen(true); }} className="p-1 hover:bg-[#454545] rounded text-[#858585] hover:text-[#cccccc]" title="New Folder"><FolderPlus className="w-3.5 h-3.5" /></button>
                    <button onClick={(e) => { e.stopPropagation(); if(confirm(`Delete folder ${node.name}?`)) deleteFile(node.path); }} className="p-1 hover:bg-[#454545] rounded text-[#858585] hover:text-[#f14c4c]" title="Delete Folder"><X className="w-3.5 h-3.5" /></button>
                </div>
            </div>
            {isOpen && children.length > 0 && (
                <div className="relative">
                    <div className="absolute top-0 bottom-0 w-[1px] bg-[#2b2b2b]" style={{ left: `${depth * 8 + 10}px` }} />
                    {children.map((child: any) => (
                        <TreeItemComponent 
                            key={child.path} 
                            node={child} 
                            depth={depth + 1} 
                            activeFileName={activeFileName} 
                            onSelect={onSelect} 
                            onContextMenu={onContextMenu} 
                            renamingFile={renamingFile} 
                            newName={newName} 
                            setNewName={setNewName} 
                            onRenameSubmit={onRenameSubmit} 
                            searchQuery={searchQuery} 
                            createFile={createFile} 
                            createFolder={createFolder} 
                            deleteFile={deleteFile} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
