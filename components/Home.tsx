import React, { useState } from 'react';
import { Course } from '../types';
import { 
    LogOut, Bell, Calendar, MapPin, Mail, Phone, 
    CheckSquare, Receipt, ClipboardList, CalendarDays, 
    Cake, Bus, ChevronRight, UserCheck, Star, BookOpen
} from 'lucide-react';
import { BusTracker } from './BusTracker';
import { FeePayment } from './FeePayment';

interface HomeProps {
    courses: Course[];
    onSelectCourse: (course: Course) => void;
    onLogout: () => void;
}

export const Home: React.FC<HomeProps> = ({ courses, onSelectCourse, onLogout }) => {
    const [isBusTrackerOpen, setIsBusTrackerOpen] = useState(false);
    const [isFeePaymentOpen, setIsFeePaymentOpen] = useState(false);

    const MenuItem = ({ 
        icon: Icon, 
        label, 
        colorClass, 
        iconColorClass,
        onClick,
        badge 
    }: { 
        icon: any, 
        label: string, 
        colorClass: string, 
        iconColorClass: string, 
        onClick: () => void, 
        badge?: number 
    }) => (
        <button 
            onClick={onClick}
            className={`aspect-square rounded-[24px] p-4 flex flex-col justify-between items-start text-left transition-transform active:scale-95 ${colorClass} relative overflow-hidden group hover:shadow-lg duration-300`}
        >
            <div className="absolute right-0 top-0 w-16 h-16 bg-white opacity-20 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            
            <div className="w-full flex justify-between items-start relative z-10">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/60 backdrop-blur-md shadow-sm ${iconColorClass}`}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
                {badge && (
                    <span className="w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm border border-white">
                        {badge}
                    </span>
                )}
            </div>
            <span className="font-semibold text-slate-700 leading-tight mt-2 text-[13px] sm:text-[15px] relative z-10">
                {label}
            </span>
        </button>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
            {/* Sticky Header */}
            <div className="bg-white/90 backdrop-blur-xl px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#5D8BF4] to-[#0EA5E9] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        O<span className="text-sky-200">5</span>
                    </div>
                    <h1 className="text-lg font-bold text-slate-800 tracking-tight">
                        Smart Pathshala
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                     <button onClick={onLogout} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            <div className="p-6 space-y-8 flex-1 overflow-y-auto pb-32 no-scrollbar">
                
                {/* School Profile Card */}
                <div className="w-full bg-gradient-to-br from-[#5D8BF4] to-[#0EA5E9] rounded-[32px] p-6 text-white shadow-xl shadow-blue-200/50 relative overflow-hidden group">
                     {/* Background shapes */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl transform translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500 opacity-20 rounded-full blur-2xl transform -translate-x-5 translate-y-5"></div>

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg p-1 shrink-0 rotate-3 group-hover:rotate-6 transition-transform">
                                <img 
                                    src="https://api.dicebear.com/7.x/initials/svg?seed=FI&backgroundColor=e0f2fe&textColor=0ea5e9" 
                                    alt="Logo" 
                                    className="w-full h-full rounded-xl"
                                />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold leading-tight mb-1">FULKURI ISLAMIC <br/> ACADEMY</h2>
                                <span className="inline-flex items-center gap-1 bg-white/20 px-2.5 py-0.5 rounded-lg text-[10px] font-medium backdrop-blur-md border border-white/10">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                    Student Portal • Estd: 1982
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-medium text-blue-50 bg-black/5 p-4 rounded-2xl border border-white/5 sm:min-w-[300px]">
                            <div className="flex items-center gap-3">
                                <MapPin size={14} className="text-white shrink-0" />
                                <span>Chapainawabganj-6300</span>
                            </div>
                             <div className="flex items-center gap-3">
                                <Mail size={14} className="text-white shrink-0" />
                                <span>Schoolfulkuri@gmail.com</span>
                            </div>
                             <div className="flex items-center gap-3">
                                <Phone size={14} className="text-white shrink-0" />
                                <span>01309124497</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Menu Grid */}
                <div>
                    <h3 className="text-slate-800 font-bold text-lg mb-4 px-1">Quick Actions</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        <MenuItem 
                            label="Attendance" 
                            icon={CheckSquare} 
                            colorClass="bg-[#E0F2F1] hover:bg-[#B2DFDB]" 
                            iconColorClass="text-[#00897B]" 
                            onClick={() => {}} 
                        />
                         <MenuItem 
                            label="Accounts" 
                            icon={Receipt} 
                            colorClass="bg-[#E3F2FD] hover:bg-[#BBDEFB]" 
                            iconColorClass="text-[#1E88E5]" 
                            onClick={() => setIsFeePaymentOpen(true)}
                            badge={1}
                        />
                         <MenuItem 
                            label="Bus Track" 
                            icon={Bus} 
                            colorClass="bg-[#FFF3E0] hover:bg-[#FFE0B2]" 
                            iconColorClass="text-[#FB8C00]" 
                            onClick={() => setIsBusTrackerOpen(true)}
                        />
                         <MenuItem 
                            label="Results" 
                            icon={ClipboardList} 
                            colorClass="bg-[#F3E5F5] hover:bg-[#E1BEE7]" 
                            iconColorClass="text-[#8E24AA]" 
                            onClick={() => {}} 
                        />
                         <div className="hidden md:block">
                            <MenuItem 
                                label="Timetable" 
                                icon={CalendarDays} 
                                colorClass="bg-slate-100 hover:bg-slate-200" 
                                iconColorClass="text-slate-600" 
                                onClick={() => {}} 
                            />
                         </div>
                    </div>
                </div>

                {/* Courses Section - Refactored Design */}
                <div>
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="text-slate-800 font-bold text-lg">My Courses</h3>
                        <button className="text-xs font-bold text-[#5D8BF4] bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
                            View All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courses.map((course) => (
                            <button
                                key={course.id}
                                onClick={() => onSelectCourse(course)}
                                className="w-full bg-white p-1 rounded-[28px] shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-[0.99] group text-left relative overflow-hidden"
                            >
                                <div className="p-4 relative z-10 flex flex-col gap-4 h-full justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className={`w-14 h-14 rounded-[20px] bg-gradient-to-br ${course.colorFrom} ${course.colorTo} flex items-center justify-center text-3xl text-white shadow-md group-hover:rotate-6 transition-transform duration-300 ring-4 ring-white`}>
                                            {course.icon}
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-bold text-slate-800 tracking-tight">${course.price}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">/mo</span>
                                            </div>
                                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100 mt-1">
                                                <Star size={10} className="fill-amber-400 text-amber-400" />
                                                <span className="text-[10px] font-bold text-amber-700">{course.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-[#5D8BF4] transition-colors">{course.title}</h4>
                                        <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed opacity-80">
                                            {course.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-2">
                                                {[1,2,3].map(i => (
                                                    <div key={i} className={`w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500`}>
                                                        {String.fromCharCode(64 + i)}
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400">{course.reviews}+ Students</span>
                                        </div>
                                        
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#5D8BF4] group-hover:text-white transition-all">
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Decorative Gradient Blob */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${course.colorFrom} ${course.colorTo} opacity-[0.03] group-hover:opacity-[0.08] rounded-bl-full transition-opacity pointer-events-none`}></div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <BusTracker isOpen={isBusTrackerOpen} onClose={() => setIsBusTrackerOpen(false)} />
            <FeePayment isOpen={isFeePaymentOpen} onClose={() => setIsFeePaymentOpen(false)} />
        </div>
    );
};