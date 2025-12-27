import React from 'react';
import Editor from '@monaco-editor/react';
import { Settings, Maximize2, Zap } from 'lucide-react';
import useEditorStore from '../../store/editorStore';

const CodeEditor = ({ language, value, onChange, title, icon }) => {
  const { theme } = useEditorStore();
  
  const handleEditorDidMount = (editor, monaco) => {
    // Add custom commands or keybindings here if needed
    // e.g., editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => { ... });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1e1e1e] transition-colors duration-300">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-[#252525] border-b border-gray-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 text-sm font-bold uppercase tracking-wider">
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-blue-500 transition-colors" title="Format Code">
                <Zap size={14} />
            </button>
            <button className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <Settings size={14} />
            </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <Editor
          height="100%"
          language={language}
          theme={theme === 'dark' ? "vs-dark" : "light"}
          value={value}
          onChange={onChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            fontLigatures: true,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            padding: { top: 16, bottom: 16 },
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoIndent: 'advanced',
            suggestSelection: 'first',
            wordWrap: 'on',
            scrollbar: {
                vertical: 'auto',
                horizontal: 'auto',
                useShadows: false,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10
            }
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
