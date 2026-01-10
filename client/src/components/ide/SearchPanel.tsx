import { useState, useMemo } from "react";
import { useCodeStore } from "../../store/useCodeStore";
import { Search, ChevronRight, ChevronDown, FileCode } from "lucide-react";

interface SearchResult {
    path: string;
    line: number;
    text: string;
    matchIndex: number;
}

export function SearchPanel() {
    const { files, setActiveFile } = useCodeStore();
    const [query, setQuery] = useState("");
    const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});

    const results = useMemo(() => {
        if (query.length < 2) return {};
        
        const matches: Record<string, SearchResult[]> = {};
        
        Object.values(files).forEach(file => {
            if (file.type === 'file' && file.content) {
                const lines = file.content.split('\n');
                lines.forEach((line, index) => {
                    if (line.toLowerCase().includes(query.toLowerCase())) {
                        if (!matches[file.path]) matches[file.path] = [];
                        matches[file.path].push({
                            path: file.path,
                            line: index + 1,
                            text: line.trim(),
                            matchIndex: line.toLowerCase().indexOf(query.toLowerCase())
                        });
                    }
                });
            }
        });
        
        return matches;
    }, [files, query]);

    const totalMatches = Object.values(results).flat().length;
    const totalFiles = Object.keys(results).length;

    return (
        <div className="h-full flex flex-col bg-[#18181b] text-[#cccccc]">
            <div className="p-4 space-y-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Search</div>
                <div className="relative group">
                    <input 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-[#3c3c3c] border border-transparent focus:border-[#007fd4] rounded px-2 py-1.5 text-sm outline-none placeholder:text-neutral-500"
                        placeholder="Search (min. 2 chars)"
                    />
                    <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-white transition-colors" />
                </div>
                
                {query.length >= 2 && (
                    <div className="text-xs text-neutral-500">
                        {totalMatches} results in {totalFiles} files
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {Object.entries(results).map(([path, fileMatches]) => (
                    <div key={path} className="flex flex-col">
                        <div 
                            className="flex items-center gap-1 px-4 py-1 hover:bg-[#2a2d2e] cursor-pointer group"
                            onClick={() => setIsExpanded(prev => ({ ...prev, [path]: !prev[path] }))}
                        >
                            {isExpanded[path] === false ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            <FileCode className="w-4 h-4 text-blue-400" />
                            <span className="text-sm truncate flex-1">{path.split('/').pop()}</span>
                            <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded-full text-neutral-400">{fileMatches.length}</span>
                        </div>
                        
                        {isExpanded[path] !== false && (
                            <div className="flex flex-col pb-2">
                                {fileMatches.map((match, i) => (
                                    <div 
                                        key={i}
                                        className="pl-10 pr-4 py-1 text-xs text-neutral-400 hover:bg-[#2a2d2e] hover:text-white cursor-pointer truncate"
                                        onClick={() => setActiveFile(match.path)}
                                    >
                                        <span className="text-neutral-600 mr-2">{match.line}:</span>
                                        <span className="italic">{match.text}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
