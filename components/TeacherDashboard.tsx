import React, { useState } from 'react';
import { LogOut, Bell, Calendar, BookOpen, Users, Clock, MapPin, CheckSquare, Plus, MoreVertical } from 'lucide-react';

interface TeacherDashboardProps {
    onLogout: () => void;
}

type TeacherTab = 'PLANNER' | 'CLASSES' | 'STUDENTS';

interface Lesson {
    id: string;
    subject: string;
    topic: string;
    time: string;
    classRoom: string;
    icon: string;
    color: string;
}

const MOCK_LESSONS: Lesson[] = [
    { id: '1', subject: 'Mathematics', topic: 'Calculus: Derivatives', time: '08:30 AM', classRoom: '302', icon: '📐', color: 'bg-orange-100 text-orange-600' },
    { id: '2', subject: 'Physics', topic: 'Quantum Mechanics Intro', time: '10:15 AM', classRoom: 'Lab A', icon: '⚡', color: 'bg-purple-100 text-purple-600' },
    { id: '3', subject: 'Chemistry', topic: 'Organic Compounds', time: '01:00 PM', classRoom: 'Lab B', icon: '🧪', color: 'bg-emerald-100 text-emerald-600' },
];

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<TeacherTab>('PLANNER');
    const lessons = MOCK_LESSONS;

    const renderContent = () => {
        switch (activeTab) {
            case 'PLANNER':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex justify-between items-center px-2">
                            <h3 className="font-bold text-slate-900 text-lg">Today's Schedule</h3>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{new Date().toLocaleDateString()}</div>
                        </div>
                        
                        <div className="space-y-4">
                            {lessons.map((l) => (
                                <div key={l.id} className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-100 flex gap-5 items-center relative overflow-visible group hover:z-10 transition-all duration-200">
                                    {/* Tooltip */}
                                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 bg-slate-900 text-white text-[10px] p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl transform translate-y-2 group-hover:translate-y-0 z-50">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-indigo-300 uppercase tracking-wide text-[9px]">Topic Info</span>
                                        </div>
                                        <p className="font-medium leading-relaxed mb-1">{l.topic}</p>
                                        <p className="text-slate-400 text-[9px]">3 resources attached • Click to view</p>
                                        
                                        {/* Arrow */}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900"></div>
                                    </div>

                                    {/* Left Bar */}
                                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-l-[32px]"></div>

                                    <div className={`w-16 h-16 rounded-[20px] ${l.color} flex items-center justify-center text-2xl shrink-0 shadow-inner`}>
                                        {l.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-900 text-lg">{l.subject}</h4>
                                            <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={16} /></button>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-2 font-medium truncate">{l.topic}</p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                                <Clock size={12} className="text-indigo-500" /> {l.time}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                                                <MapPin size={12} className="text-orange-500" /> Rm {l.classRoom}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <button className="p-4 bg-indigo-600 rounded-[24px] text-white flex flex-col items-center gap-2 shadow-lg shadow-indigo-200 active:scale-95 transition-transform">
                                <Plus size={24} />
                                <span className="text-xs font-bold">New Lesson</span>
                            </button>
                            <button className="p-4 bg-white border border-slate-100 rounded-[24px] text-slate-600 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-transform">
                                <CheckSquare size={24} />
                                <span className="text-xs font-bold">Attendance</span>
                            </button>
                        </div>
                    </div>
                );
            case 'CLASSES':
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 animate-in fade-in zoom-in duration-300">
                        <BookOpen size={48} className="mb-4 opacity-50" />
                        <p className="font-bold">Classes Module</p>
                    </div>
                );
            case 'STUDENTS':
                    return (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 animate-in fade-in zoom-in duration-300">
                        <Users size={48} className="mb-4 opacity-50" />
                        <p className="font-bold">Students Directory</p>
                    </div>
                );
            default: 
                return null;
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 relative">
                {/* Header */}
            <div className="px-6 py-6 bg-white/80 backdrop-blur-md border-b border-slate-100 z-10 shrink-0 sticky top-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold border-2 border-white shadow-sm">
                            JD
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Teacher</p>
                            <h1 className="text-sm font-bold text-slate-900">John Doe</h1>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm border border-slate-100 transition-colors">
                            <Bell size={18} />
                        </button>
                        <button onClick={onLogout} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pb-32 no-scrollbar">
                {renderContent()}
            </div>

                {/* Tab Bar */}
            <div className="absolute bottom-0 w-full bg-white border-t border-slate-100 p-2 pb-6 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around items-center px-2">
                    {[
                        { id: 'PLANNER', icon: Calendar, label: 'Planner' },
                        { id: 'CLASSES', icon: BookOpen, label: 'Classes' },
                        { id: 'STUDENTS', icon: Users, label: 'Students' },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TeacherTab)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 ${activeTab === tab.id ? 'text-indigo-600 bg-indigo-50 w-20' : 'text-slate-400 w-16'}`}
                        >
                            <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                            <span className={`text-[9px] font-bold ${activeTab === tab.id ? 'block' : 'hidden'}`}>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};