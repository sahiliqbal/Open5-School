import React, { useState } from 'react';
import { CactusLogo } from './CactusLogo';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ScanFace, ChevronLeft, Backpack } from 'lucide-react';

interface LoginProps {
    onSuccess: () => void;
    onStudentLogin?: () => void;
    onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onStudentLogin, onBack }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingType, setLoadingType] = useState<'generic' | 'student' | null>(null);

    const authenticate = (callback: () => void, type: 'generic' | 'student') => {
        setIsLoading(true);
        setLoadingType(type);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setLoadingType(null);
            callback();
        }, 1500);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        authenticate(onSuccess, 'generic');
    };

    const handleStudentLogin = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onStudentLogin) {
            authenticate(onStudentLogin, 'student');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-purple-100/60 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[20%] left-[-10%] w-64 h-64 bg-blue-100/60 rounded-full blur-3xl"></div>

            {/* Header */}
            <div className="pt-12 px-6 pb-6 relative z-10">
                <button 
                    onClick={onBack}
                    className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 shadow-sm active:scale-95 transition-all"
                >
                    <ChevronLeft size={20} />
                </button>
            </div>

            <div className="flex-1 px-8 flex flex-col relative z-10 overflow-y-auto no-scrollbar pb-10">
                <div className="mb-8">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center mb-6">
                        <CactusLogo size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back!</h1>
                    <p className="text-slate-400 text-sm">Please enter your details to sign in.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Email</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5D8BF4] transition-colors">
                                <Mail size={20} />
                            </div>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="student@cactus9.edu"
                                className="w-full bg-white border border-slate-100 rounded-[20px] py-4 pl-12 pr-4 text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5D8BF4]/20 focus:border-[#5D8BF4] transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5D8BF4] transition-colors">
                                <Lock size={20} />
                            </div>
                            <input 
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-white border border-slate-100 rounded-[20px] py-4 pl-12 pr-12 text-slate-800 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#5D8BF4]/20 focus:border-[#5D8BF4] transition-all shadow-sm"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <div className="text-right">
                            <button type="button" className="text-xs font-bold text-[#5D8BF4] hover:text-blue-700">Forgot Password?</button>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[#5D8BF4] to-[#4F46E5] text-white font-bold text-lg py-4 rounded-[24px] shadow-xl shadow-blue-200/50 mt-4 active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                    >
                        {loadingType === 'generic' ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                Sign In <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                    
                    {onStudentLogin && (
                        <button 
                            type="button"
                            onClick={handleStudentLogin}
                            disabled={isLoading}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-4 rounded-[24px] shadow-xl shadow-orange-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                        >
                            {loadingType === 'student' ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Student Login <Backpack size={20} />
                                </>
                            )}
                        </button>
                    )}
                </form>

                <div className="mt-8 flex items-center gap-4">
                    <div className="h-[1px] bg-slate-200 flex-1"></div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Or continue with</span>
                    <div className="h-[1px] bg-slate-200 flex-1"></div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                    <button className="flex items-center justify-center gap-2 bg-white border border-slate-100 py-3 rounded-[20px] shadow-sm hover:bg-slate-50 transition-colors">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                        <span className="text-sm font-bold text-slate-600">Google</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-white border border-slate-100 py-3 rounded-[20px] shadow-sm hover:bg-slate-50 transition-colors">
                        <ScanFace size={20} className="text-slate-800" />
                        <span className="text-sm font-bold text-slate-600">Face ID</span>
                    </button>
                </div>
            </div>

            <div className="p-6 text-center">
                <p className="text-sm text-slate-500">
                    Don't have an account? <button className="font-bold text-[#FF7F43]">Sign Up</button>
                </p>
            </div>
        </div>
    );
};