import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import EmbedView from './pages/EmbedView';
import './styles/globals.css';
import useEditorStore from './store/editorStore';
import ToastContainer from './components/UI/ToastContainer';

function App() {
  const { theme, fetchSiteSettings } = useEditorStore();

  React.useEffect(() => {
    fetchSiteSettings();
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Public/Anonymous Routes */}
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/embed/:id" element={<EmbedView />} />
          
          {/* User Dashboard Routes */}
          <Route path="/dashboard/:role" element={<Dashboard />} />
          <Route path="/dashboard/:role/pens" element={<Dashboard />} />
          <Route path="/dashboard/:role/insights" element={<Dashboard />} />
          <Route path="/dashboard/:role/settings/profile" element={<Dashboard />} />
          <Route path="/dashboard/:role/editor" element={<EditorPage />} />
          <Route path="/dashboard/:role/editor/:id" element={<EditorPage />} />
          
          {/* Admin Routes */}
          <Route path="/dashboard/:role/admin/overviews" element={<Dashboard />} />
          <Route path="/dashboard/:role/admin/notifications" element={<Dashboard />} />
          <Route path="/dashboard/:role/admin/frontend" element={<Dashboard />} />
          <Route path="/dashboard/:role/admin/users" element={<Dashboard />} />

        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
