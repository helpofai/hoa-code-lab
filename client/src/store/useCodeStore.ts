import { create } from 'zustand';

export interface FSItem {
  name: string;
  path: string;
  type: 'file' | 'folder';
  language?: string;
  content?: string;
}

interface CodeState {
  files: Record<string, FSItem>;
  activeProject: any | null;
  activeFileName: string | null;
  openFiles: string[];
  setFileContent: (path: string, content: string) => void;
  setFiles: (files: Record<string, FSItem>) => void;
  setActiveProject: (project: any) => void;
  setActiveFile: (path: string) => void;
  closeFile: (path: string) => void;
  createFile: (path: string, language: string) => void;
  createFolder: (path: string) => void;
  renameFile: (oldPath: string, newPath: string) => void;
  deleteFile: (path: string) => void;
}

export const useCodeStore = create<CodeState>((set) => ({
  files: {}, // Start empty for real projects
  activeProject: null,
  activeFileName: null,
  openFiles: [],
  
  setFileContent: (path, content) => 
    set((state) => ({
      files: {
        ...state.files,
        [path]: { ...state.files[path], content }
      }
    })),

  setFiles: (files) => {
    const filePaths = Object.keys(files).filter(p => files[p].type === 'file');
    set({ 
        files, 
        activeFileName: filePaths[0] || null,
        openFiles: filePaths.length > 0 ? [filePaths[0]] : []
    });
  },

  setActiveProject: (project) => set({ activeProject: project }),

  setActiveFile: (path) => 
    set((state) => {
        if (state.files[path]?.type === 'folder') return state;
        return { 
            activeFileName: path,
            openFiles: state.openFiles.includes(path) 
                ? state.openFiles 
                : [...state.openFiles, path]
        };
    }),

  closeFile: (path) =>
    set((state) => {
        const newOpenFiles = state.openFiles.filter(f => f !== path);
        let newActiveFile = state.activeFileName;
        
        if (state.activeFileName === path) {
            newActiveFile = newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null;
        }

        return {
            openFiles: newOpenFiles,
            activeFileName: newActiveFile
        };
    }),

  createFile: (path, language) =>
    set((state) => ({
      files: {
        ...state.files,
        [path]: { name: path.split('/').pop() || path, path, type: 'file', language, content: '' }
      },
      openFiles: [...state.openFiles, path],
      activeFileName: path
    })),

  createFolder: (path) =>
    set((state) => ({
      files: {
        ...state.files,
        [path]: { name: path.split('/').pop() || path, path, type: 'folder' }
      }
    })),

  renameFile: (oldPath, newPath) =>
    set((state) => {
        const item = state.files[oldPath];
        if (!item) return state;

        const newFiles = { ...state.files };
        delete newFiles[oldPath];
        newFiles[newPath] = { ...item, name: newPath.split('/').pop() || newPath, path: newPath };

        const newOpenFiles = state.openFiles.map(f => f === oldPath ? newPath : f);
        const newActiveFile = state.activeFileName === oldPath ? newPath : state.activeFileName;

        return {
            files: newFiles,
            openFiles: newOpenFiles,
            activeFileName: newActiveFile
        };
    }),

  deleteFile: (path) =>
    set((state) => {
        const newFiles = { ...state.files };
        delete newFiles[path];

        const newOpenFiles = state.openFiles.filter(f => f !== path);
        let newActiveFile = state.activeFileName;
        if (state.activeFileName === path) {
            newActiveFile = newOpenFiles.length > 0 ? newOpenFiles[newOpenFiles.length - 1] : null;
        }

        return {
            files: newFiles,
            openFiles: newOpenFiles,
            activeFileName: newActiveFile
        };
    }),
}));