import React, { useState } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import useEditorStore from '../store/editorStore';
import Button from '../components/UI/Button';
import { motion } from 'framer-motion';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setUser = useEditorStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.register(username, email, password);
      setUser(data.user);
      navigate(`/dashboard/${data.user.role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#060606] text-slate-900 dark:text-white transition-colors duration-300">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-6 py-20 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
           <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[120px] animate-blob"></div>
           <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="glass-card p-8 rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl">
            <h2 className="text-3xl font-black mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">Sign Up for Free</h2>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-600 dark:text-red-400 rounded-lg text-sm text-center font-medium"
              >
                {error}
              </motion.div>
            )}

             <div className="flex gap-4 mb-8">
               <button className="flex-1 py-2.5 bg-slate-100 dark:bg-[#2d2d2d] hover:bg-slate-200 dark:hover:bg-[#363636] rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm">
                 <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                 GitHub
               </button>
               <button className="flex-1 py-2.5 bg-slate-100 dark:bg-[#2d2d2d] hover:bg-slate-200 dark:hover:bg-[#363636] rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm">
                 <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"/></svg>
                 Google
               </button>
            </div>

            <div className="relative mb-8 text-center">
               <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
               </div>
               <span className="relative bg-white/50 dark:bg-[#1e1e1e]/50 px-4 text-xs font-bold tracking-wider text-gray-500 uppercase backdrop-blur-sm">Or sign up with email</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Username</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all placeholder-gray-400"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-slate-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all placeholder-gray-400"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Password</label>
                <input 
                  type="password" 
                  className="w-full bg-slate-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all placeholder-gray-400"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                className="w-full"
                isLoading={loading}
              >
                Sign Up
              </Button>
            </form>
            
            <p className="mt-8 text-center text-sm text-slate-600 dark:text-gray-400">
               Already have an account? <Link to="/login" className="text-green-600 dark:text-green-400 font-bold hover:underline">Log in</Link>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Signup;