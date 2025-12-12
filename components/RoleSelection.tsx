import React from 'react';
import { UserRole } from '../types';
import { CactusLogo } from './CactusLogo';

interface RoleSelectionProps {
    onSelectRole: (role: UserRole) => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col p-6 pt-12 relative overflow-hidden">
            {/* Brand Header */}
            <div className="z-10 mb-10 flex flex-col items-start">
                <div className="flex items-center gap-3 mb-4">
                    <CactusLogo size={64} />
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight leading-none flex items-center">
                            <span className="text-[#F97316]">Open</span>
                            <span className="text-[#DC2626]">5</span>
                        </h1>
                        <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">EduSphere ERP System</p>
                    </div>
                </div>
                <p className="text-slate-500 max-w-xs leading-relaxed">
                    Welcome to the next generation of smart school management. Please select your portal to continue.
                </p>
            </div>

            {/* Background Decorations */}
            <div className="absolute top-[-10%] right-[-20%] w-80 h-80 bg-cyan-100/50 rounded-full blur-3xl opacity-60 mix-blend-multiply"></div>
            <div className="absolute bottom-[-10%] left-[-20%] w-80 h-80 bg-orange-100/50 rounded-full blur-3xl opacity-60 mix-blend-multiply"></div>
            <div className="absolute top-[40%] left-[50%] w-60 h-60 bg-emerald-100/30 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>

            <div className="space-y-5 z-10 flex-1 flex flex-col justify-center pb-12">
                
                {/* Student Card */}
                <button 
                    onClick={() => onSelectRole('STUDENT')}
                    className="w-full bg-white p-6 rounded-[32px] shadow-xl shadow-indigo-100/50 border border-white flex items-center gap-5 hover:scale-[1.02] transition-all active:scale-[0.98] group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl flex items-center justify-center text-3xl group-hover:rotate-6 transition-transform shadow-inner ring-1 ring-indigo-100 relative z-10">
                        🎒
                    </div>
                    <div className="text-left relative z-10">
                        <h3 className="font-bold text-slate-800 text-lg">Student Portal</h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Classes, Fees & Homework</p>
                    </div>
                    <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                        <svg className="w-6 h-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>

                {/* Teacher Card */}
                <button 
                    onClick={() => onSelectRole('TEACHER')}
                    className="w-full bg-white p-6 rounded-[32px] shadow-xl shadow-orange-100/50 border border-white flex items-center gap-5 hover:scale-[1.02] transition-all active:scale-[0.98] group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center text-3xl group-hover:rotate-6 transition-transform shadow-inner ring-1 ring-orange-100 relative z-10">
                        🍎
                    </div>
                    <div className="text-left relative z-10">
                        <h3 className="font-bold text-slate-800 text-lg">Teacher Portal</h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Attendance & Planner</p>
                    </div>
                     <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                        <svg className="w-6 h-6 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>

                {/* Admin Card */}
                <button 
                    onClick={() => onSelectRole('ADMIN')}
                    className="w-full bg-white p-6 rounded-[32px] shadow-xl shadow-emerald-100/50 border border-white flex items-center gap-5 hover:scale-[1.02] transition-all active:scale-[0.98] group relative overflow-hidden"
                >
                     <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center text-3xl group-hover:rotate-6 transition-transform shadow-inner ring-1 ring-emerald-100 relative z-10">
                        📊
                    </div>
                    <div className="text-left relative z-10">
                        <h3 className="font-bold text-slate-800 text-lg">Admin Portal</h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Management & Reports</p>
                    </div>
                     <div className="absolute right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                        <svg className="w-6 h-6 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>
            </div>
            
            <div className="text-center pb-4">
                <p className="text-[10px] text-slate-400 font-medium">Open5 v3.0 • Powered by Gemini AI</p>
            </div>
        </div>
    );
};