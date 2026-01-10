import Editor, { type OnMount } from "@monaco-editor/react";
import { useRef, useEffect } from "react";
import { useCodeStore } from "../store/useCodeStore";

export function CodeEditor() {
  const editorRef = useRef<any>(null);
  const { files, activeFileName, setFileContent } = useCodeStore();
  const activeFile = activeFileName ? files[activeFileName] : null;

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    monaco.editor.defineTheme('hoa-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
            'editor.background': '#0a0a0a', 
        }
    });
    monaco.editor.setTheme('hoa-dark');
  };

  // Sync editor value when active file changes
  useEffect(() => {
    if (editorRef.current && activeFile) {
        // We might want to save view state here (scroll position etc)
        // But for now just simple model update is fine, Monaco handles model switching if we used setModel
        // But here we are just changing value/language
    }
  }, [activeFileName]);

  if (!activeFile) return <div className="p-4 text-neutral-500">No file selected</div>;

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        path={activeFile.name} // This helps Monaco keep track of models/state per file
        language={activeFile.language}
        value={activeFile.content}
        onChange={(value) => setFileContent(activeFile.name, value || "")}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 }
        }}
      />
    </div>
  );
}