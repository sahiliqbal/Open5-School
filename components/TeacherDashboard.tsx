import React, { useState } from 'react';
import { MOCK_ATTENDANCE, MOCK_SALARY } from '../constants';
import { LogOut, DollarSign, Calendar, Plus, Home, ClipboardList, GraduationCap, X, CheckCircle, FileText } from 'lucide-react';

interface TeacherDashboardProps {
    onLogout: () => void;
}

type Tab = 'HOME' | 'PLANNER' | 'ASSIGNMENTS' | 'GRADING';

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<Tab>('HOME');
    const [attendance] = useState(MOCK_ATTENDANCE);

    // Mock Data State for Planner
    const [lessons, setLessons] = useState([
        { id: '1', time: '09:00 AM', subject: 'Math', topic: 'Calculus', classRoom: '302', icon: '📐', color: 'bg-indigo-50' },
        { id: '2', time: '11:30 AM', subject: 'Physics', topic: 'Laws of Motion', classRoom: 'Lab 2', icon: '⚡', color: 'bg-orange-50' }
    ]);

    // Mock Data State for Grading
    const [submissions, setSubmissions] = useState([
        { id: '1', studentName: 'Alice Johnson', title: 'Calculus Homework #4', date: 'Feb 24', status: 'PENDING', content: 'Attached is the PDF solution for the derivatives problem set. I found question 3 particularly challenging. I used the chain rule as discussed in class.', grade: '', feedback: '' },
        { id: '2', studentName: 'Bob Smith', title: 'Physics Lab Report', date: 'Feb 23', status: 'GRADED', content: 'Experiment results regarding projectile motion. Please see the data table on page 2.', grade: '88/100', feedback: 'Great analysis, but check your significant figures in the conclusion.' },
        { id: '3', studentName: 'Charlie Brown', title: 'Calculus Homework #4', date: 'Feb 24', status: 'PENDING', content: 'Here are my answers. I used the chain rule for the last section.', grade: '', feedback: '' },
        { id: '4', studentName: 'Daisy Miller', title: 'Biology Essay', date: 'Feb 22', status: 'GRADED', content: 'The structure of the cell membrane and its functions.', grade: 'A', feedback: 'Excellent detail on the phospholipid bilayer.' },
    ]);

    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [gradeInput, setGradeInput] = useState('');
    const [feedbackInput, setFeedbackInput] = useState('');

    const handleAddLesson = () => {
        // In a real app, this would open a modal form
        const newLesson = {
            id: Date.now().toString(),
            time: '01:00 PM',
            subject: 'Biology',
            topic: 'New Topic',
            classRoom: '101',
            icon: '🧬',
            color: 'bg-emerald-50'
        };
        setLessons([...lessons, newLesson]);
    };

    const openGradingModal = (sub: any) => {
        setSelectedSubmission(sub);
        setGradeInput(sub.grade);
        setFeedbackInput(sub.feedback);
    };

    const handleSaveGrade = () => {
        if (!selectedSubmission) return;
        
        setSubmissions(prev => prev.map(s => 
            s.id === selectedSubmission.id 
                ? { ...s, grade: gradeInput, feedback: feedbackInput, status: 'GRADED' }
                : s
        ));
        setSelectedSubmission(null);
    };

    const renderHeader = () => (
        <div className="px-6 py-6 pb-8 bg-indigo-600 text-white rounded-b-[32px] shadow-lg shadow-indigo-200 z-10 shrink-0">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <span className="bg-indigo-500/50 border border-indigo-400/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Teacher Portal</span>
                    <h1 className="text-2xl font-bold mt-2">Hello, Sarah 👋</h1>
                </div>
                <button onClick={onLogout} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors">
                    <LogOut size={20} />
                </button>
            </div>
            {activeTab === 'HOME' && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-xs text-indigo-100 uppercase font-bold mb-1">Upcoming Salary</p>
                        <h2 className="text-2xl font-bold">${MOCK_SALARY.total.toLocaleString()}</h2>
                    </div>
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-lg">
                        <DollarSign size={20} />
                    </div>
                </div>
            )}
        </div>
    );

    const renderContent = () => {
        switch(activeTab) {
            case 'HOME':
                return (
                    <div className="space-y-6">
                        <div className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100">
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-800">Attendance</h3>
                                <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">Mark All</button>
                             </div>
                             <div className="grid grid-cols-1 gap-3">
                                {attendance.map(s => (
                                    <div key={s.id} className="flex items-center justify-between p-3 rounded-2xl border border-slate-50 bg-slate-50/50">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl ${s.avatarColor} flex items-center justify-center font-bold`}>{s.name[0]}</div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{s.name}</p>
                                                <p className="text-xs text-slate-400">Roll: {s.rollNo}</p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-lg text-xs font-bold ${s.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                            {s.status}
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                );
            case 'PLANNER':
                return (
                    <div className="space-y-4 pb-20">
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="font-bold text-slate-800">Today's Schedule</h3>
                        </div>
                        {lessons.map(l => (
                            <div key={l.id} className="bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 flex gap-4 animate-in slide-in-from-bottom duration-300">
                                <div className={`w-16 flex flex-col items-center justify-center rounded-2xl ${l.color} text-lg shrink-0`}>
                                    {l.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 truncate">{l.subject}</h4>
                                    <p className="text-xs text-slate-500 mb-2 truncate">{l.topic}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{l.time}</span>
                                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">Room {l.classRoom}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'ASSIGNMENTS':
            case 'GRADING':
                return (
                    <div className="space-y-4 pb-20">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-slate-800">Student Submissions</h3>
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                                {submissions.filter(s => s.status === 'PENDING').length} Pending
                            </span>
                        </div>

                        <div className="space-y-3">
                            {submissions.map((sub, idx) => (
                                <button 
                                    key={sub.id} 
                                    onClick={() => openGradingModal(sub)}
                                    className="w-full bg-white p-4 rounded-[24px] shadow-sm border border-slate-100 flex items-center justify-between active:scale-[0.98] transition-all text-left group animate-in slide-in-from-bottom duration-500"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${
                                            sub.status === 'GRADED' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                                        }`}>
                                            {sub.studentName.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm mb-0.5">{sub.title}</h4>
                                            <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                                {sub.studentName} <span className="w-1 h-1 rounded-full bg-slate-300"></span> {sub.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                                        sub.status === 'GRADED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                                    }`}>
                                        {sub.status}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            default:
                return <div className="p-8 text-center text-slate-400 font-medium">Section under maintenance</div>;
        }
    }

    return (
        <div className="h-full flex flex-col bg-slate-50 relative">
            {renderHeader()}
            
            <div className="flex-1 overflow-y-auto p-6 pb-28 no-scrollbar">
                {renderContent()}
            </div>
            
            {/* Floating Action Button for Planner */}
            {activeTab === 'PLANNER' && (
                <button 
                    onClick={handleAddLesson}
                    className="absolute bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-300 active:scale-90 hover:bg-indigo-700 transition-all z-30 animate-in zoom-in duration-200"
                >
                    <Plus size={24} />
                </button>
            )}

            {/* Grading Modal */}
            {selectedSubmission && (
                <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full h-[95%] sm:h-auto sm:max-h-[85vh] rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden m-0 sm:m-4">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">Grading Assignment</h3>
                                <p className="text-xs text-slate-400 font-medium">{selectedSubmission.title}</p>
                            </div>
                            <button onClick={() => setSelectedSubmission(null)} className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                            {/* Student Info */}
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg shadow-sm">
                                    {selectedSubmission.studentName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{selectedSubmission.studentName}</p>
                                    <p className="text-xs text-slate-500 font-medium">Submitted on {selectedSubmission.date}</p>
                                </div>
                            </div>

                            {/* Submission Content */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText size={16} className="text-slate-400"/>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Submission Content</p>
                                </div>
                                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">"{selectedSubmission.content}"</p>
                                </div>
                            </div>

                            {/* Grading Form */}
                            <div className="space-y-5">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wide">Grade / Score</label>
                                    <input 
                                        type="text" 
                                        value={gradeInput}
                                        onChange={(e) => setGradeInput(e.target.value)}
                                        placeholder="e.g. 95/100 or A"
                                        className="w-full mt-2 p-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-800 shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-700 ml-1 uppercase tracking-wide">Feedback</label>
                                    <textarea 
                                        value={feedbackInput}
                                        onChange={(e) => setFeedbackInput(e.target.value)}
                                        placeholder="Write your feedback here..."
                                        className="w-full mt-2 p-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm h-32 resize-none shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-slate-100 bg-white z-10">
                            <button 
                                onClick={handleSaveGrade}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={20} />
                                Submit Grade
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Nav */}
            <div className="bg-white border-t border-slate-200 p-2 pb-6 absolute bottom-0 w-full z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around items-center">
                    {['HOME', 'PLANNER', 'ASSIGNMENTS', 'GRADING'].map((tab) => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab as Tab)}
                            className={`p-3 rounded-2xl transition-all flex flex-col items-center gap-1 ${activeTab === tab ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            {tab === 'HOME' && <Home size={24} />}
                            {tab === 'PLANNER' && <Calendar size={24} />}
                            {tab === 'ASSIGNMENTS' && <ClipboardList size={24} />}
                            {tab === 'GRADING' && <GraduationCap size={24} />}
                            <span className="text-[9px] font-bold">{tab}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};