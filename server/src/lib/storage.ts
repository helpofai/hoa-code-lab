import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_STORAGE = path.join(__dirname, '../../ProjectStore');

export async function ensureProjectFolder(username: string, projectId: string | number) {
    const projectPath = path.join(ROOT_STORAGE, username, projectId.toString());
    try {
        await fs.mkdir(projectPath, { recursive: true });
        return projectPath;
    } catch (error) {
        console.error("Failed to create project folder:", error);
        throw error;
    }
}

export async function writeProjectFiles(projectPath: string, filesJson: string) {
    try {
        const files = JSON.parse(filesJson);
        for (const [filePath, item] of Object.entries(files)) {
            const fsItem = item as any;
            const fullPath = path.join(projectPath, filePath);
            
            if (fsItem.type === 'folder') {
                await fs.mkdir(fullPath, { recursive: true });
            } else {
                // Ensure parent directory exists
                await fs.mkdir(path.dirname(fullPath), { recursive: true });
                await fs.writeFile(fullPath, fsItem.content || '');
            }
        }
    } catch (error) {
        console.error("Failed to write project files to disk:", error);
    }
}

export async function readProjectFiles(projectPath: string) {
    const result: Record<string, any> = {};

    async function walk(dir: string, base: string = '') {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
            const relativePath = base ? `${base}/${entry.name}` : entry.name;
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                result[relativePath] = {
                    name: entry.name,
                    path: relativePath,
                    type: 'folder'
                };
                await walk(fullPath, relativePath);
            } else {
                const content = await fs.readFile(fullPath, 'utf-8');
                result[relativePath] = {
                    name: entry.name,
                    path: relativePath,
                    type: 'file',
                    content: content,
                    language: entry.name.split('.').pop() || 'text'
                };
            }
        }
    }

    try {
        await walk(projectPath);
        return result;
    } catch (error) {
        return null;
    }
}
