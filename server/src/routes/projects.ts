import { Router } from "express";
import { db } from "../db/index.js";
import { projects, users } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import jwt from "jsonwebtoken";
import path from "path";
import { ensureProjectFolder, writeProjectFiles, readProjectFiles } from "../lib/storage.js";
import { createGitHubRepo, syncFilesToGitHub, fetchFilesFromGitHub, getGitHubBranches, getGitHubCommits } from "../lib/github.js";
import { getTemplateFiles } from "../lib/templates.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-this";

// Auth Middleware
export const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

const projectSchema = z.object({
  name: z.string().min(1),
  type: z.string(),
  files: z.string().optional(),
});

// Get all projects for user
router.get("/", authenticate, async (req: any, res) => {
  try {
    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, req.userId));
    res.json(userProjects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Create new project
router.post("/", authenticate, async (req: any, res) => {
  try {
    const { name, type, files: providedFiles } = projectSchema.parse(req.body);

    const [user] = await db.select().from(users).where(eq(users.id, req.userId));
    if (!user) return res.status(404).json({ error: "User not found" });

    // TEMPLATE LOGIC
    let files = providedFiles ? JSON.parse(providedFiles) : {};
    if (Object.keys(files).length === 0) {
        files = getTemplateFiles(type);
    }
    const filesJson = JSON.stringify(files);

    // 1. Create GitHub Repo if token exists
    let githubRepoFullName = null;
    if (user.githubToken) {
        const repoName = `hoa-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
        githubRepoFullName = await createGitHubRepo(user.githubToken, repoName);
    }

    // 2. Save to DB
    const result = await db.insert(projects).values({
      name,
      type,
      userId: req.userId,
      githubRepo: githubRepoFullName,
    });
    
    const insertId = (result as any)[0].insertId;
    
    // 3. Sync to local disk cache
    const projectPath = await ensureProjectFolder(user.username, insertId);
    await writeProjectFiles(projectPath, filesJson);
    
    // 4. Sync initial files to GitHub
    if (user.githubToken && githubRepoFullName) {
        await syncFilesToGitHub(user.githubToken, githubRepoFullName, filesJson);
    }
    
    const [newProject] = await db.select().from(projects).where(eq(projects.id, insertId));
    res.json(newProject);
  } catch (error: any) {
    console.error("Create Project Error:", error);
    res.status(500).json({ error: error.message || "Failed to create project" });
  }
});

// Get single project
router.get("/:id", authenticate, async (req: any, res) => {
  try {
    const [project] = await db
      .select()
      .from(projects)
      .where(
        and(
          eq(projects.id, parseInt(req.params.id)),
          eq(projects.userId, req.userId)
        )
      );
    
    if (!project) return res.status(404).json({ error: "Project not found" });

    const [user] = await db.select().from(users).where(eq(users.id, req.userId));
    if (!user) return res.status(404).json({ error: "User not found" });

    const projectPath = path.join(process.cwd(), 'ProjectStore', user.username, project.id.toString());
    let files = await readProjectFiles(projectPath);

    if (!files && project.githubRepo && user.githubToken) {
        files = await fetchFilesFromGitHub(user.githubToken, project.githubRepo, project.githubBranch || 'main');
        await ensureProjectFolder(user.username, project.id);
        await writeProjectFiles(projectPath, JSON.stringify(files));
    }
    
    res.json({ ...project, files: files ? JSON.stringify(files) : "{}" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// Update project files (LOCAL CACHE + DB ONLY)
router.put("/:id", authenticate, async (req: any, res) => {
  try {
    const { files } = z.object({ files: z.string() }).parse(req.body);
    
    const [user] = await db.select().from(users).where(eq(users.id, req.userId));
    const [project] = await db.select().from(projects).where(eq(projects.id, parseInt(req.params.id)));
    
    if (!user || !project) return res.status(404).json({ error: "Not found" });

    // 1. Update Database
    await db.update(projects)
      .set({ updatedAt: new Date() })
      .where(and(eq(projects.id, project.id), eq(projects.userId, req.userId)));
    
    // 2. Sync to local disk cache ONLY
    const projectPath = await ensureProjectFolder(user.username, req.params.id);
    await writeProjectFiles(projectPath, files);
    
    res.json({ success: true });
  } catch (error) {
    console.error("Local Save Error:", error);
    res.status(500).json({ error: "Failed to save project locally" });
  }
});

// Explicit Push to GitHub
router.post("/:id/push", authenticate, async (req: any, res) => {
    try {
        const [user] = await db.select().from(users).where(eq(users.id, req.userId));
        const [project] = await db.select().from(projects).where(eq(projects.id, parseInt(req.params.id)));
        
        if (!user || !project) return res.status(404).json({ error: "Not found" });
        if (!user.githubToken || !project.githubRepo) {
            return res.status(400).json({ error: "Project not linked to GitHub" });
        }

        // Read files from local disk cache to push
        const projectPath = path.join(process.cwd(), 'ProjectStore', user.username, project.id.toString());
        const files = await readProjectFiles(projectPath);
        
        if (!files) return res.status(400).json({ error: "No files found to push" });

        // Sync to GitHub
        const success = await syncFilesToGitHub(user.githubToken, project.githubRepo, JSON.stringify(files), project.githubBranch || 'main');
        
        if (!success) throw new Error("GitHub API rejected the push");

        res.json({ success: true });
    } catch (error: any) {
        console.error("Push Error:", error);
        res.status(500).json({ error: error.message || "Failed to push to GitHub" });
    }
});

// Pull from GitHub
router.post("/:id/pull", authenticate, async (req: any, res) => {
    try {
        const [user] = await db.select().from(users).where(eq(users.id, req.userId));
        const [project] = await db.select().from(projects).where(eq(projects.id, parseInt(req.params.id)));
        
        if (!user || !project || !project.githubRepo || !user.githubToken) {
            return res.status(400).json({ error: "Sync failed: Missing link or token" });
        }

        const files = await fetchFilesFromGitHub(user.githubToken, project.githubRepo, project.githubBranch || 'main');
        const projectPath = await ensureProjectFolder(user.username, req.params.id);
        await writeProjectFiles(projectPath, JSON.stringify(files));

        res.json({ files });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get Git Info
router.get("/:id/git-info", authenticate, async (req: any, res) => {
    try {
        const [user] = await db.select().from(users).where(eq(users.id, req.userId));
        const [project] = await db.select().from(projects).where(eq(projects.id, parseInt(req.params.id)));
        
        if (!user || !project || !project.githubRepo || !user.githubToken) {
            return res.json({ branches: ['main'], commits: [] });
        }

        const [branches, commits] = await Promise.all([
            getGitHubBranches(user.githubToken, project.githubRepo),
            getGitHubCommits(user.githubToken, project.githubRepo)
        ]);

        res.json({ branches, commits });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch git info" });
    }
});

// Initialize GitHub Repository for existing project
router.post("/:id/init-repo", authenticate, async (req: any, res) => {
    try {
        const [user] = await db.select().from(users).where(eq(users.id, req.userId));
        const [project] = await db.select().from(projects).where(eq(projects.id, parseInt(req.params.id)));
        
        if (!user || !project) return res.status(404).json({ error: "Not found" });
        if (project.githubRepo) return res.status(400).json({ error: "Project already linked to GitHub" });
        if (!user.githubToken) return res.status(400).json({ error: "GitHub token missing" });

        const repoName = `hoa-${project.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
        const githubRepoFullName = await createGitHubRepo(user.githubToken, repoName);

        await db.update(projects)
            .set({ githubRepo: githubRepoFullName })
            .where(eq(projects.id, project.id));

        const projectPath = await ensureProjectFolder(user.username, req.params.id);
        const files = await readProjectFiles(projectPath);
        if (files) {
            await syncFilesToGitHub(user.githubToken, githubRepoFullName, JSON.stringify(files));
        }

        const [updatedProject] = await db.select().from(projects).where(eq(projects.id, project.id));
        res.json(updatedProject);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message || "Failed to initialize repository" });
    }
});

// Import from GitHub
router.post("/import", authenticate, async (req: any, res) => {
    try {
        const { repoFullName, name } = z.object({ 
            repoFullName: z.string(), 
            name: z.string().min(1) 
        }).parse(req.body);

        const [user] = await db.select().from(users).where(eq(users.id, req.userId));
        if (!user || !user.githubToken) return res.status(400).json({ error: "GitHub token missing" });

        const files = await fetchFilesFromGitHub(user.githubToken, repoFullName);

        const result = await db.insert(projects).values({
            name,
            type: "imported",
            userId: req.userId,
            githubRepo: repoFullName,
            githubBranch: "main"
        });

        const insertId = (result as any)[0].insertId;
        const projectPath = await ensureProjectFolder(user.username, insertId);
        await writeProjectFiles(projectPath, JSON.stringify(files));

        const [newProject] = await db.select().from(projects).where(eq(projects.id, insertId));
        res.json(newProject);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message || "Failed to import project" });
    }
});

// Delete project
router.delete("/:id", authenticate, async (req: any, res) => {
    try {
      await db.delete(projects).where(
          and(
            eq(projects.id, parseInt(req.params.id)),
            eq(projects.userId, req.userId)
          )
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
});

export default router;
