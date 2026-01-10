import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuthStore } from "../store/useAuthStore";

// Schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 chars"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 chars"),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

const Background = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute inset-0 bg-neutral-950/20 opacity-20 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3F%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    </div>
);

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: registerErrors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/auth/login', data);
      setAuth(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterForm) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.post('/api/auth/register', data);
      setAuth(res.data.user, res.data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 relative font-sans selection:bg-blue-500/30">
      <Background />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group cursor-pointer">
                 <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                        H
                 </div>
                 <span className="font-bold text-2xl tracking-tight text-white group-hover:text-blue-100 transition-colors">HOA Code Lab</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">{isLogin ? "Welcome Back" : "Get Started"}</h1>
            <p className="text-neutral-400">{isLogin ? "Sign in to continue building." : "Create your workspace today."}</p>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
        >
            <AnimatePresence mode="wait">
                {isLogin ? (
                    <motion.form
                        key="login"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onSubmit={handleSubmitLogin(onLogin)}
                        className="space-y-4"
                    >
                        {error && <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/20">{error}</div>}
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <input 
                                    {...registerLogin("email")}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-10 py-3 text-sm focus:outline-none focus:border-blue-500/50"
                                    placeholder="name@example.com"
                                />
                            </div>
                            {loginErrors.email && <p className="text-xs text-red-400 ml-1">{loginErrors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-medium text-neutral-300">Password</label>
                                <a href="#" className="text-xs text-blue-400 hover:text-blue-300">Forgot?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <input 
                                    type="password"
                                    {...registerLogin("password")}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-10 py-3 text-sm focus:outline-none focus:border-blue-500/50"
                                    placeholder="••••••••"
                                />
                            </div>
                             {loginErrors.password && <p className="text-xs text-red-400 ml-1">{loginErrors.password.message}</p>}
                        </div>

                        <button disabled={isLoading} className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 mt-4">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                        </button>
                    </motion.form>
                ) : (
                    <motion.form
                        key="register"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onSubmit={handleSubmitRegister(onRegister)}
                        className="space-y-4"
                    >
                         {error && <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/20">{error}</div>}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300 ml-1">Username</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <input 
                                    {...registerRegister("username")}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-10 py-3 text-sm focus:outline-none focus:border-blue-500/50"
                                    placeholder="johndoe"
                                />
                            </div>
                            {registerErrors.username && <p className="text-xs text-red-400 ml-1">{registerErrors.username.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <input 
                                    {...registerRegister("email")}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-10 py-3 text-sm focus:outline-none focus:border-blue-500/50"
                                    placeholder="name@example.com"
                                />
                            </div>
                            {registerErrors.email && <p className="text-xs text-red-400 ml-1">{registerErrors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                                <input 
                                    type="password"
                                    {...registerRegister("password")}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-10 py-3 text-sm focus:outline-none focus:border-blue-500/50"
                                    placeholder="••••••••"
                                />
                            </div>
                            {registerErrors.password && <p className="text-xs text-red-400 ml-1">{registerErrors.password.message}</p>}
                        </div>

                         <button disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-blue-500/20">
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="mt-6 text-center">
                <button 
                    onClick={() => { setIsLogin(!isLogin); setError(null); }}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                >
                    {isLogin ? (
                        <>Don't have an account? <span className="text-blue-400 font-medium">Sign up</span></>
                    ) : (
                        <>Already have an account? <span className="text-blue-400 font-medium">Log in</span></>
                    )}
                </button>
            </div>
        </motion.div>
      </div>
    </div>
  );
}