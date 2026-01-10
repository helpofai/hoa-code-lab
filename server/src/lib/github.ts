import { Octokit } from "octokit";

export async function createGitHubRepo(token: string, repoName: string) {
    const octokit = new Octokit({ auth: token });
    
    try {
        // 1. Create the repository
        const response = await octokit.rest.repos.createForAuthenticatedUser({
            name: repoName,
            private: true, // Default to private for user security
            auto_init: true, // Initialize with a README
        });

        return response.data.full_name; // e.g., "username/repo-name"
    } catch (error: any) {
        console.error("GitHub Repo Creation Error:", error.message);
        throw new Error(`Failed to create GitHub repository: ${error.message}`);
    }
}

export async function syncFilesToGitHub(token: string, repoFullName: string, filesJson: string, branch: string = 'main') {
    const octokit = new Octokit({ auth: token });
    const [owner, repo] = repoFullName.split('/');
    const files = JSON.parse(filesJson);

    try {
        // Get the latest commit SHA for the branch
        const { data: refData } = await octokit.rest.git.getRef({
            owner,
            repo,
            ref: `heads/${branch}`,
        });
        const latestCommitSha = refData.object.sha;

        // Get the tree SHA for the latest commit
        const { data: commitData } = await octokit.rest.git.getCommit({
            owner,
            repo,
            commit_sha: latestCommitSha,
        });
        const baseTreeSha = commitData.tree.sha;

        // Prepare the tree blobs (only files, skipping folders as Git handles them via file paths)
        const treeItems = [];
        for (const [path, item] of Object.entries(files)) {
            const fsItem = item as any;
            if (fsItem.type === 'file') {
                treeItems.push({
                    path,
                    mode: '100644' as const,
                    type: 'blob' as const,
                    content: fsItem.content || '',
                });
            }
        }

        if (treeItems.length === 0) return;

        // Create a new tree
        const { data: newTreeData } = await octokit.rest.git.createTree({
            owner,
            repo,
            base_tree: baseTreeSha,
            tree: treeItems,
        });

        // Create a new commit
        const { data: newCommitData } = await octokit.rest.git.createCommit({
            owner,
            repo,
            message: `Sync from HOA Code Lab - ${new Date().toISOString()}`,
            tree: newTreeData.sha,
            parents: [latestCommitSha],
        });

        // Update the ref
        await octokit.rest.git.updateRef({
            owner,
            repo,
            ref: `heads/${branch}`,
            sha: newCommitData.sha,
        });

        return true;
    } catch (error: any) {
        console.error("GitHub Sync Error:", error.message);
        return false;
    }
}

export async function fetchFilesFromGitHub(token: string, repoFullName: string, branch: string = 'main') {
    const octokit = new Octokit({ auth: token });
    const [owner, repo] = repoFullName.split('/');

    try {
        // 1. Get the tree SHA for the branch
        const { data: refData } = await octokit.rest.git.getRef({ owner, repo, ref: `heads/${branch}` });
        const treeSha = refData.object.sha;

        // 2. Get the full recursive tree
        const { data: treeData } = await octokit.rest.git.getTree({
            owner,
            repo,
            tree_sha: treeSha,
            recursive: "true"
        });

        const files: Record<string, any> = {};

        // 3. Fetch content for each blob
        for (const item of treeData.tree) {
            if (item.type === 'blob' && item.path) {
                const { data: blobData } = await octokit.rest.git.getBlob({
                    owner,
                    repo,
                    file_sha: item.sha!
                });
                
                // Decode base64 content
                const content = Buffer.from(blobData.content, 'base64').toString('utf8');
                
                files[item.path] = {
                    name: item.path.split('/').pop(),
                    path: item.path,
                    type: 'file',
                    content: content,
                    language: item.path.split('.').pop() || 'text'
                };
            } else if (item.type === 'tree' && item.path) {
                files[item.path] = {
                    name: item.path.split('/').pop(),
                    path: item.path,
                    type: 'folder'
                };
            }
        }

        return files;
    } catch (error: any) {
        console.error("GitHub Fetch Error:", error.message);
        throw new Error(`Failed to fetch from GitHub: ${error.message}`);
    }
}

export async function getGitHubBranches(token: string, repoFullName: string) {
    const octokit = new Octokit({ auth: token });
    const [owner, repo] = repoFullName.split('/');
    try {
        const { data } = await octokit.rest.repos.listBranches({ owner, repo });
        return data.map(b => b.name);
    } catch (error) {
        return ['main'];
    }
}

export async function getGitHubCommits(token: string, repoFullName: string) {
    const octokit = new Octokit({ auth: token });
    const [owner, repo] = repoFullName.split('/');
    try {
        const { data } = await octokit.rest.repos.listCommits({ owner, repo, per_page: 10 });
        return data.map(c => ({
            sha: c.sha,
            message: c.commit.message,
            author: c.commit.author?.name,
            date: c.commit.author?.date
        }));
    } catch (error) {
        return [];
    }
}
