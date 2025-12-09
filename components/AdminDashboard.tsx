import React, { useState } from 'react';
import { LogOut, Bell, Home, PieChart, Users, Calendar, Package, Plus, UserCog, MessageSquare, BookOpen } from 'lucide-react';
import { MOCK_COURSES } from '../constants';

interface AdminDashboardProps {
    onLogout: () => void;
}

type Tab = 'DASHBOARD' | 'COURSES' | 'FINANCE' | 'EXAMS' | 'STUDENTS' | 'INVENTORY';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');

    const StatCard = ({ label, value, color }: any) => (
        <div className={`p-5 rounded-[24px] ${color} text-white shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
            <div className="relative z-10">
                <p className="text-xs font-bold uppercase opacity-80 mb-1">{label}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
        </div>
    );

    const renderContent = () => {
        switch(activeTab) {
            case 'DASHBOARD':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard label="Students" value="5,909" color="bg-orange-500" />
                            <StatCard label="Teachers" value="60" color="bg-indigo-500" />
                            <StatCard label="Revenue" value="$24k" color="bg-emerald-500" />
                            <StatCard label="Messages" value="128" color="bg-purple-500" />
                        </div>
                        
                        <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-800">Quick Actions</h3>
                            </div>
                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                <button className="flex flex-col items-center gap-2 min-w-[80px]">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"><UserCog size={20}/></div>
                                    <span className="text-xs font-medium text-slate-500">Users</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 min-w-[80px]">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"><MessageSquare size={20}/></div>
                                    <span className="text-xs font-medium text-slate-500">Broadcast</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 min-w-[80px]">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"><Calendar size={20}/></div>
                                    <span className="text-xs font-medium text-slate-500">Events</span>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'COURSES':
                return (
                    <div className="space-y-4">
                         <div className="flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">All Courses</h3>
                            <button className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"><Plus size={18}/></button>
                         </div>
                         {MOCK_COURSES.map(c => (
                             <div key={c.id} className="bg-white p-4 rounded-[24px] border border-slate-100 flex items-center gap-4 hover:shadow-sm transition-shadow">
                                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br ${c.colorFrom} ${c.colorTo} text-white shadow-sm`}>{c.icon}</div>
                                 <div>
                                     <h4 className="font-bold text-slate-800">{c.title}</h4>
                                     <p className="text-xs text-slate-400">{c.syllabus.length} Topics</p>
                                 </div>
                             </div>
                         ))}
                    </div>
                );
            default:
                return <div className="text-center p-8 text-slate-400 font-medium">Module Active</div>;
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 relative">
            <div className="px-6 py-6 bg-white border-b border-slate-100 z-10 shrink-0">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Console</p>
                        <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
                    </div>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"><Bell size={20}/></button>
                        <button onClick={onLogout} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"><LogOut size={20}/></button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pb-32 no-scrollbar">
                {renderContent()}
            </div>

            <div className="absolute bottom-0 w-full bg-white border-t border-slate-100 p-2 pb-6 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center px-4 overflow-x-auto no-scrollbar gap-2">
                     {[
                        { id: 'DASHBOARD', icon: Home, label: 'Home' },
                        { id: 'COURSES', icon: BookOpen, label: 'Courses' },
                        { id: 'FINANCE', icon: PieChart, label: 'Finance' },
                        { id: 'EXAMS', icon: Calendar, label: 'Exams' },
                        { id: 'STUDENTS', icon: Users, label: 'Users' },
                        { id: 'INVENTORY', icon: Package, label: 'Assets' },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-xl transition-colors ${activeTab === tab.id ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
                            <span className="text-[9px] font-bold">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};