import { create } from 'zustand';
import { WebContainer } from '@webcontainer/api';

interface WebContainerState {
  instance: WebContainer | null;
  isReady: boolean;
  init: () => Promise<void>;
  mount: (files: Record<string, any>) => Promise<void>;
  run: (command: string, args: string[], onData: (data: string) => void) => Promise<any>;
  spawnShell: (onData: (data: string) => void) => Promise<any>;
  snapshot: () => Promise<Record<string, any>>;
  writeFile: (path: string, content: string) => Promise<void>;
}

let webContainerInstance: WebContainer | null = null;
let bootPromise: Promise<void> | null = null;

export const useWebContainerStore = create<WebContainerState>((set, get) => ({
  instance: null,
  isReady: false,
  init: async () => {
    if (webContainerInstance) return;
    if (bootPromise) return bootPromise;

    bootPromise = (async () => {
        try {
            console.log("Booting WebContainer...");
            webContainerInstance = await WebContainer.boot();
            set({ instance: webContainerInstance, isReady: true });
            console.log("WebContainer booted!");
        } catch (error) {
            console.error("Failed to boot WebContainer:", error);
        }
    })();

    return bootPromise;
  },
  mount: async (files) => {
    const { instance } = get();
    if (!instance) return;

    const webContainerFiles: any = {};
    
    Object.values(files).forEach((file: any) => {
        const parts = file.path.split('/');
        let current = webContainerFiles;
        
        parts.forEach((part: string, index: number) => {
            if (index === parts.length - 1) {
                if (file.type === 'file') {
                    current[part] = { file: { contents: file.content || '' } };
                } else {
                    current[part] = { directory: {} };
                }
            } else {
                if (!current[part]) current[part] = { directory: {} };
                current = current[part].directory;
            }
        });
    });

    await instance.mount(webContainerFiles);
  },
  run: async (command, args, onData) => {
    const { instance } = get();
    if (!instance) return;

    const process = await instance.spawn(command, args);
    process.output.pipeTo(new WritableStream({
        write(data) {
            onData(data);
        }
    }));
    return process;
  },
  spawnShell: async (onData) => {
    const { instance } = get();
    if (!instance) return;

    const shellProcess = await instance.spawn('jsh', {
        terminal: {
            cols: 80,
            rows: 24,
        },
    });

    shellProcess.output.pipeTo(new WritableStream({
        write(data) {
            onData(data);
        }
    }));

    return shellProcess;
  },
  snapshot: async () => {
    const { instance } = get();
    if (!instance) return {};

    const result: Record<string, any> = {};

    async function walk(dir: string) {
        try {
            const entries = await instance!.fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const path = dir === '.' ? entry.name : `${dir}/${entry.name}`;
                
                if (entry.isDirectory()) {
                    result[path] = { name: entry.name, path, type: 'folder' };
                    
                    // --- PROFESSIONAL OPTIMIZATION ---
                    // If it's node_modules, we show the folder but don't walk into it
                    // This prevents the "10,000 files" freeze while still showing the folder exists
                    if (entry.name === 'node_modules' || entry.name === '.git') {
                        continue; 
                    }
                    
                    await walk(path);
                } else {
                    try {
                        const contents = await instance!.fs.readFile(path, 'utf-8');
                        result[path] = { 
                            name: entry.name, 
                            path, 
                            type: 'file', 
                            content: contents,
                            language: entry.name.split('.').pop() || 'text'
                        };
                    } catch (e) {
                        console.warn("Could not read file:", path);
                    }
                }
            }
        } catch (err) {
            console.warn("Could not read directory:", dir);
        }
    }

    await walk('.');
    return result;
  },
  writeFile: async (path, content) => {
    const { instance } = get();
    if (!instance) return;
    await instance.fs.writeFile(path, content);
  }
}));