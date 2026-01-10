import { Router } from "express";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { Octokit } from "octokit";
import { authenticate } from "./projects.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-change-this";

const formatUser = (user: any) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    githubToken: user.githubToken,
    githubRepoVisibility: user.githubRepoVisibility || 'private',
    githubAutoSync: !!user.githubAutoSync,
    githubDefaultBranch: user.githubDefaultBranch || 'main'
});

// Schemas
const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = registerSchema.parse(req.body);
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) return res.status(400).json({ error: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(users).values({ username, email, password: hashedPassword });
    const [user] = await db.select().from(users).where(eq(users.email, email));
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update GitHub Token (WITH VERIFICATION)
router.post("/update-github", authenticate, async (req: any, res) => {
  try {
    const { githubToken } = z.object({ githubToken: z.string() }).parse(req.body);
    const trimmedToken = githubToken.trim();

    if (!trimmedToken) {
        await db.update(users).set({ githubToken: null }).where(eq(users.id, req.userId));
        const [updatedUser] = await db.select().from(users).where(eq(users.id, req.userId));
        return res.json({ user: formatUser(updatedUser) });
    }

    // --- VERIFICATION STEP ---
    try {
        const octokit = new Octokit({ auth: trimmedToken });
        const { headers } = await octokit.rest.users.getAuthenticated();
        
        // Check scopes
        const scopes = headers['x-oauth-scopes']?.split(', ') || [];
        if (!scopes.includes('repo')) {
            return res.status(400).json({ error: "Token missing 'repo' scope." });
        }
    } catch (err: any) {
        console.error("Token verification failed:", err.message);
        return res.status(401).json({ error: `GitHub rejected token: ${err.message}` });
    }
    // -------------------------

    await db.update(users)
      .set({ githubToken: trimmedToken })
      .where(eq(users.id, req.userId));
    
    const [updatedUser] = await db.select().from(users).where(eq(users.id, req.userId));
    res.json({ user: formatUser(updatedUser) });
  } catch (error) {
    console.error("Update GitHub Error:", error);
    res.status(500).json({ error: "Failed to update GitHub token" });
  }
});

// Update GitHub Settings
router.post("/update-github-settings", authenticate, async (req: any, res) => {
    try {
        const schema = z.object({
            githubRepoVisibility: z.enum(['public', 'private']).optional(),
            githubAutoSync: z.boolean().optional(),
            githubDefaultBranch: z.string().optional()
        });
        const data = schema.parse(req.body);
        const updateData: any = {};
        if (data.githubRepoVisibility) updateData.githubRepoVisibility = data.githubRepoVisibility;
        if (data.githubAutoSync !== undefined) updateData.githubAutoSync = data.githubAutoSync ? 1 : 0;
        if (data.githubDefaultBranch) updateData.githubDefaultBranch = data.githubDefaultBranch;
        await db.update(users).set(updateData).where(eq(users.id, req.userId));
        const [updatedUser] = await db.select().from(users).where(eq(users.id, req.userId));
        res.json({ user: formatUser(updatedUser) });
    } catch (error) {
        res.status(500).json({ error: "Failed to update settings" });
    }
});

// Get GitHub Profile
router.get("/github-profile", authenticate, async (req: any, res) => {
    try {
        const [user] = await db.select().from(users).where(eq(users.id, req.userId));
        if (!user || !user.githubToken) return res.status(404).json({ error: "No token" });

        const octokit = new Octokit({ auth: user.githubToken });
        const [profile, rateLimit] = await Promise.all([
            octokit.rest.users.getAuthenticated(),
            octokit.rest.rateLimit.get()
        ]);

        res.json({
            profile: profile.data,
            rateLimit: rateLimit.data.resources.core,
            scopes: profile.headers['x-oauth-scopes']?.split(', ') || []
        });
    } catch (error: any) {
        res.status(401).json({ error: "Token expired or invalid." });
    }
});

// List User Repositories
router.get("/github-repos", authenticate, async (req: any, res) => {
    const [user] = await db.select().from(users).where(eq(users.id, req.userId));
    if (!user || !user.githubToken) return res.status(404).json({ error: "No token" });

    try {
        const octokit = new Octokit({ auth: user.githubToken });
        const { data } = await octokit.rest.repos.listForAuthenticatedUser({
            sort: 'updated',
            per_page: 100
        });
        res.json(data.map(repo => ({
            id: repo.id,
            full_name: repo.full_name,
            name: repo.name,
            description: repo.description,
            private: repo.private,
            updated_at: repo.updated_at
        })));
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch repositories" });
    }
});

export default router;
