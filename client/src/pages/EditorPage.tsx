import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { CodeEditor } from "../components/CodeEditor";
import { FileTree } from "../components/FileTree";
import { Preview } from "../components/Preview";
import { Terminal } from "../components/Terminal";
import { useSocket } from "../hooks/useSocket";
import { useWebContainerStore } from "../store/useWebContainerStore";
import { useCodeStore } from "../store/useCodeStore";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios";
import { Save, Loader2, ChevronLeft } from "lucide-react";

const API_URL = "http://localhost:3000/api/projects";

export function EditorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = searchParams.get("id");
  const { token } = useAuthStore();
  const { files, setFiles } = useCodeStore();
  const { init } = useWebContainerStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(!!projectId);

  useSocket();

  useEffect(() => {
    init();
    if (projectId) {
        loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
        const res = await axios.get(`${API_URL}/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.files) {
            const parsedFiles = JSON.parse(res.data.files);
            if (Object.keys(parsedFiles).length > 0) {
                setFiles(parsedFiles);
            }
        }
    } catch (err) {
        console.error("Failed to load project", err);
    } finally {
        setIsPageLoading(false);
    }
  };

  const saveProject = async () => {
    if (!projectId) return;
    setIsSaving(true);
    try {
        await axios.put(`${API_URL}/${projectId}`, {
            files: JSON.stringify(files)
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (err) {
        console.error("Failed to save project", err);
    } finally {
        setIsSaving(false);
    }
  };

  if (isPageLoading) {
      return (
          <div className="h-screen w-full bg-neutral-950 flex items-center justify-center text-white">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
      );
  }

  return (
    <Layout 
      header={
          <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                  <button 
                    onClick={() => navigate("/dashboard")}
                    className="p-1.5 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-white transition-colors"
                  >
                      <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">HOA Code Lab</span>
              </div>
              <div className="flex items-center gap-3">
                  <button 
                    onClick={saveProject}
                    disabled={isSaving || !projectId}
                    className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-all"
                  >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {isSaving ? "Saving..." : "Save"}
                  </button>
              </div>
          </div>
      }
      sidebar={<FileTree />}
      editor={<CodeEditor />}
      preview={<Preview />}
      terminal={<Terminal />}
    />
  );
}