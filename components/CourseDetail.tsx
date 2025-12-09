import React, { useState } from 'react';
import { Course } from '../types';
import { ChevronLeft, Star, PlayCircle, Lock, MessageCircle, ArrowRight } from 'lucide-react';
import { GeminiTutor } from './GeminiTutor';

interface CourseDetailProps {
    course: Course;
    onBack: () => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ course, onBack }) => {
    const [isTutorOpen, setIsTutorOpen] = useState(false);
    
    // Dynamic system instruction
    const tutorSystemInstruction = `You are an expert AI Tutor for the course "${course.title}".
    Course Description: ${course.description}
    Syllabus Topics:
    ${course.syllabus.map(item => `- ${item.title} (${item.duration})`).join('\n')}
    Your goal is to help the student understand these specific topics. Keep answers concise.`;

    const isFirstItemUnlocked = course.syllabus.length > 0 && !course.syllabus[0].isLocked;

    return (
        <div className="h-full bg-white flex flex-col relative overflow-hidden">
            {/* Navbar */}
            <div className="px-6 py-4 flex justify-between items-center z-20 absolute top-0 left-0 right-0 pointer-events-none">
                <button 
                    onClick={onBack}
                    className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors text-white pointer-events-auto shadow-lg"
                >
                    <ChevronLeft size={20} />
                </button>
            </div>

            {/* Hero Section */}
            <div className={`w-full h-[320px] bg-gradient-to-br ${course.colorFrom} ${course.colorTo} relative shrink-0`}>
                 <div className="absolute inset-0 bg-black/10"></div>
                 <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 pt-32 bg-gradient-to-t from-black/60 to-transparent">
                     <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-1 rounded-lg bg-white/20 backdrop-blur-md border border-white/10 text-xs font-bold text-white">
                            Intermediate
                        </span>
                        <div className="flex items-center gap-1 text-amber-300">
                            <Star size={14} fill="currentColor" />
                            <span className="text-sm font-bold text-white">{course.rating}</span>
                        </div>
                     </div>
                     <h1 className="text-3xl font-bold text-white mb-2 leading-tight">{course.title}</h1>
                     <p className="text-white/80 text-sm line-clamp-2 max-w-md">{course.description}</p>
                 </div>
                 
                 {/* Icon Decoration */}
                 <div className="absolute top-24 right-8 text-9xl opacity-20 filter blur-sm select-none animate-pulse">
                     {course.icon}
                 </div>
            </div>

            {/* Syllabus List Container */}
            <div className="flex-1 bg-white -mt-8 rounded-t-[32px] relative z-10 px-6 pt-8 pb-32 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Course Content</h2>
                    <span className="text-xs font-bold text-slate-400">{course.syllabus.length} Lessons</span>
                </div>

                <div className="space-y-4">
                    {course.syllabus.map((item, index) => (
                        <div 
                            key={item.id} 
                            className={`flex items-center justify-between p-4 rounded-2xl transition-all border ${
                                index === 0 
                                ? 'bg-indigo-50 border-indigo-100' 
                                : 'bg-white border-slate-100 hover:border-slate-200'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                                    index === 0 ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-400'
                                }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <h3 className={`font-bold text-sm mb-0.5 ${index === 0 ? 'text-indigo-900' : 'text-slate-700'}`}>{item.title}</h3>
                                    <p className="text-xs text-slate-400 font-medium">{item.duration}</p>
                                </div>
                            </div>
                            
                            <button className={`w-10 h-10 rounded-full flex items-center justify-center ${item.isLocked ? 'text-slate-300' : 'text-indigo-500 bg-white shadow-sm'}`}>
                                {item.isLocked ? <Lock size={16} /> : <PlayCircle size={24} fill="currentColor" className="text-indigo-500 bg-white rounded-full" />}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-6 z-20 flex gap-3 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                 <button 
                    onClick={() => setIsTutorOpen(true)}
                    className="aspect-square h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex flex-col items-center justify-center shadow-sm active:scale-95 transition-transform border border-indigo-100 hover:bg-indigo-100"
                >
                    <MessageCircle size={22} />
                    <span className="text-[9px] font-bold mt-1">AI Help</span>
                </button>
                
                <button className="flex-1 bg-slate-900 text-white font-bold text-base rounded-2xl shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    {isFirstItemUnlocked ? 'Continue Learning' : 'Start Course'}
                    <ArrowRight size={18} />
                </button>
            </div>

             <GeminiTutor 
                isOpen={isTutorOpen} 
                onClose={() => setIsTutorOpen(false)} 
                courseTitle={course.title}
                systemInstruction={tutorSystemInstruction}
            />
        </div>
    );
};