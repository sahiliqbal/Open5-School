import React, { useState } from 'react';
import { Course } from '../types';
import { 
    LogOut, Receipt, MapPin, Mail, Phone, 
    CheckSquare, Bus, ClipboardList, CalendarDays, 
    Star, ChevronRight
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

    const MenuItem = ({ icon: Icon, label, color, onClick, badge }: any) => (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center gap-2 p-2 rounded-2xl active:scale-95 transition-all hover:bg-slate-100/50 border border-transparent hover:border-slate-100 group min-w-[72px]`}
        >
            <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow relative`}>
                <Icon size={24} />
                {badge && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {badge}
                    </span>
                )}
            </div>
            <span className="text-xs font-semibold text-slate-600 text-center leading-tight max-w-[70px]">
                {label}
            </span>
        </button>
    );

    return (
        <div className="h-full flex flex-col bg-slate-50 overflow-hidden relative">
            {/* Header */}
            <div className="bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        O<span className="text-indigo-200">5</span>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold text-slate-800 leading-none">Smart Pathshala</h1>
                        <p className="text-[10px] text-slate-400 font-medium">Student Portal</p>
                    </div>
                </div>
                <button onClick={onLogout} className="p-2.5 bg-slate-50 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-32">
                
                {/* ID Card / School Profile */}
                <div className="w-full bg-slate-900 rounded-[32px] p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden group shrink-0">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500 opacity-20 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-500 opacity-20 rounded-full blur-2xl transform -translate-x-5 translate-y-5"></div>

                    <div className="relative z-10">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-1 shadow-lg shrink-0">
                                <img 
                                    src="https://api.dicebear.com/7.x/initials/svg?seed=FI&backgroundColor=indigo&textColor=white" 
                                    alt="Logo" 
                                    className="w-full h-full rounded-xl"
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-bold leading-tight mb-1">Fulkuri Islamic Academy</h2>
                                <p className="text-slate-400 text-xs flex items-center gap-1">
                                    <MapPin size={10} /> Chapainawabganj-6300
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/5">
                                <p className="text-[10px] text-slate-300 mb-0.5">Contact</p>
                                <p className="text-xs font-semibold flex items-center gap-1.5"><Phone size={10} /> 01309124497</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/5">
                                <p className="text-[10px] text-slate-300 mb-0.5">Email</p>
                                <p className="text-xs font-semibold flex items-center gap-1.5 truncate"><Mail size={10} /> school@open5.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="shrink-0">
                    <h3 className="text-slate-800 font-bold text-base mb-4 px-1">Quick Actions</h3>
                    <div className="flex justify-between gap-2 overflow-x-auto no-scrollbar pb-2">
                        <MenuItem 
                            label="Attendance" 
                            icon={CheckSquare} 
                            color="bg-emerald-500" 
                            onClick={() => {}} 
                        />
                         <MenuItem 
                            label="Accounts" 
                            icon={Receipt} 
                            color="bg-sky-500" 
                            onClick={() => setIsFeePaymentOpen(true)}
                            badge={1}
                        />
                         <MenuItem 
                            label="Bus Track" 
                            icon={Bus} 
                            color="bg-orange-500" 
                            onClick={() => setIsBusTrackerOpen(true)}
                        />
                         <MenuItem 
                            label="Results" 
                            icon={ClipboardList} 
                            color="bg-purple-500" 
                            onClick={() => {}} 
                        />
                        <MenuItem 
                            label="Schedule" 
                            icon={CalendarDays} 
                            color="bg-indigo-500" 
                            onClick={() => {}} 
                        />
                    </div>
                </div>

                {/* Courses List */}
                <div className="pb-4">
                    <div className="flex justify-between items-center mb-4 px-1">
                        <h3 className="text-slate-800 font-bold text-base">My Courses</h3>
                        <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
                            View All
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courses.map((course) => (
                            <button
                                key={course.id}
                                onClick={() => onSelectCourse(course)}
                                className="w-full bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-md transition-all active:scale-[0.99] group text-left relative overflow-hidden"
                            >
                                <div className="flex items-start gap-4 z-10 relative">
                                    <div className={`w-16 h-16 rounded-[20px] bg-gradient-to-br ${course.colorFrom} ${course.colorTo} flex items-center justify-center text-3xl text-white shadow-md shrink-0`}>
                                        {course.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-base font-bold text-slate-800 truncate mb-1">{course.title}</h4>
                                            <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                                <ChevronRight size={14} />
                                            </div>
                                        </div>
                                        
                                        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                                            {course.description}
                                        </p>

                                        <div className="flex items-center gap-3">
                                             <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                                                <Star size={10} className="fill-amber-400 text-amber-400" />
                                                <span className="text-[10px] font-bold text-amber-700">{course.rating}</span>
                                            </div>
                                            <span className="text-[10px] font-medium text-slate-400">{course.reviews} Reviews</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals - Absolute to simulate phone modal within frame */}
            {isBusTrackerOpen && (
                 <div className="absolute inset-0 z-50">
                    <BusTracker isOpen={isBusTrackerOpen} onClose={() => setIsBusTrackerOpen(false)} />
                 </div>
            )}
            {isFeePaymentOpen && (
                <div className="absolute inset-0 z-50">
                     <FeePayment isOpen={isFeePaymentOpen} onClose={() => setIsFeePaymentOpen(false)} />
                </div>
            )}
        </div>
    );
};