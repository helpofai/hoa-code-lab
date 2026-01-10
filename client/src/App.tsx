import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { EditorPage } from "./pages/EditorPage";
import { AuthPage } from "./pages/Auth";
import { Dashboard } from "./pages/Dashboard";
import { IDEPage } from "./pages/IDEPage";
import { Settings } from "./pages/Settings";
import { NewProject } from "./pages/NewProject";
import { Templates } from "./pages/Templates";
import { useAuthStore } from "./store/useAuthStore";
import type { ReactNode } from "react";

function ProtectedRoute({ children }: { children: ReactNode }) {
    const user = useAuthStore((state) => state.user);
    if (!user) {
        return <Navigate to="/auth" replace />;
    }
    return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route 
            path="/dashboard" 
            element={
                <ProtectedRoute>
                    <Dashboard />
                </ProtectedRoute>
            } 
        />
        <Route 
            path="/dashboard/newproject" 
            element={
                <ProtectedRoute>
                    <NewProject />
                </ProtectedRoute>
            } 
        />
        <Route 
            path="/dashboard/templates" 
            element={
                <ProtectedRoute>
                    <Templates />
                </ProtectedRoute>
            } 
        />
        <Route 
            path="/settings" 
            element={
                <ProtectedRoute>
                    <Settings />
                </ProtectedRoute>
            } 
        />
        <Route 
            path="/dashboard/ide" 
            element={
                <ProtectedRoute>
                    <IDEPage />
                </ProtectedRoute>
            } 
        />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;