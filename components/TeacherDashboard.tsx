import React, { useState, useEffect } from 'react';
import { MOCK_ATTENDANCE, MOCK_SALARY } from '../constants';
import { LogOut, DollarSign, Calendar, Plus, Home, ClipboardList, GraduationCap, X, CheckCircle, FileText, Users, Clock, MapPin, Check, Layers, Square } from 'lucide-react';

interface TeacherDashboardProps {
    onLogout: () => void;
}

type Tab = 'HOME' | 'PLANNER' | 'ASSIGNMENTS' | 'GRADING';

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<Tab>('HOME');
    const [attendance] = useState(MOCK_ATTENDANCE);

    // Mock Data State for Planner
    const [lessons, setLessons] = useState([
        { id: '1', time: '09:00 AM', subject: 'Mathematics', topic: 'Calculus II', classRoom: '302', icon: '📐', color: 'bg-indigo-100 text-indigo-600' },
        { id: '2', time: '11:30 AM', subject: 'Physics', topic: 'Thermodynamics', classRoom: 'Lab 2', icon: '⚡', color: 'bg-orange-100 text-orange-600' }
    ]);

    // Mock Data for Assignments Overview
    const [assignments] = useState([
        { id: '1', title: 'Calculus Homework #4', subject: 'Math', dueDate: 'Feb 24, 2024', points: 100, submitted: 24, total: 30, color: 'text-indigo-600 bg-indigo-50' },
        { id: '2', title: 'Physics Lab Report', subject: 'Physics', dueDate: 'Feb 23, 2024', points: 50, submitted: 28, total: 30, color: 'text-orange-600 bg-orange-50' },
        { id: '3', title: 'Biology Essay', subject: 'Biology', dueDate: 'Feb 22, 2024', points: 20, submitted: 30, total: 30, color: 'text-emerald-600 bg-emerald-50' },
    ]);

    // Mock Data State for Grading
    const [submissions, setSubmissions] = useState([
        { id: '1', studentName: 'Alice Johnson', title: 'Calculus Homework #4', date: 'Feb 24', time: '10:30 AM', status: 'PENDING', content: 'Attached is the PDF solution for the derivatives problem set.', grade: '', feedback: '' },
        { id: '2', studentName: 'Bob Smith', title: 'Physics Lab Report', date: 'Feb 23', time: '02:15 PM', status: 'GRADED', content: 'Experiment results regarding projectile motion.', grade: '88/100', feedback: 'Great analysis.' },
        { id: '3', studentName: 'Charlie Brown', title: 'Calculus Homework #4', date: 'Feb 24', time: '09:45 AM', status: 'PENDING', content: 'Here are my answers.', grade: '', feedback: '' },
        { id: '4', studentName: 'David Wilson', title: 'Calculus Homework #4', date: 'Feb 24', time: '11:00 AM', status: 'PENDING', content: 'Completed the assignment.', grade: '', feedback: '' },
        { id: '5', studentName: 'Eva Green', title: 'Calculus Homework #4', date: 'Feb 24', time: '11:15 AM', status: 'PENDING', content: 'Please review my work.', grade: '', feedback: '' },
    ]);

    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [gradeInput, setGradeInput] = useState('');
    const [feedbackInput, setFeedbackInput] = useState('');

    // Bulk Grading State
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showBulkModal, setShowBulkModal] = useState(false);

    useEffect(() => {
        setIsSelectionMode(false);
        setSelectedIds([]);
    }, [activeTab]);

    const handleAddLesson = () => {
        const newLesson = {
            id: Date.now().toString(),
            time: '01:00 PM',
            subject: 'Biology',
            topic: 'New Topic',
            classRoom: '101',
            icon: '🧬',
            color: 'bg-emerald-100 text-emerald-600'
        };
        setLessons([...lessons, newLesson]);
    };

    const openGradingModal = (sub: any) => {
        setSelectedSubmission(sub);
        const numericGrade = sub.grade ? sub.grade.toString().split('/')[0] : '';
        setGradeInput(numericGrade);
        setFeedbackInput(sub.feedback);
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const openBulkModal = () => {
        setGradeInput('');
        setFeedbackInput('');
        setShowBulkModal(true);
    };

    const handleSaveGrade = () => {
        if (!selectedSubmission) return;
        setSubmissions(prev => prev.map(s => 
            s.id === selectedSubmission.id 
                ? { ...s, grade: gradeInput ? `${gradeInput}/100` : '', feedback: feedbackInput, status: 'GRADED' }
                : s
        ));
        setSelectedSubmission(null);
    };

    const handleBulkSave = () => {
        setSubmissions(prev => prev.map(s => {
            if (selectedIds.includes(s.id)) {
                return {
                    ...s,
                    grade: gradeInput ? `${gradeInput}/100` : (s.grade || ''),
                    feedback: feedbackInput || (s.feedback || ''),
                    status: 'GRADED'
                };
            }
            return s;
        }));
        setShowBulkModal(false);
        setIsSelectionMode(false);
        setSelectedIds([]);
    };

    const renderHeader = () => (
        <div className="px-6 py-8 bg-slate-900 text-white rounded-b-[40px] shadow-2xl z-10 shrink-0 relative overflow-hidden">
             {/* Abstract BG */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-20"></div>
             <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-500 rounded-full blur-[60px] opacity-10"></div>

            <div className="relative z-10 flex justify-between items-start mb-8">
                <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Teacher Portal</p>
                    <h1 className="text-3xl font-bold">Hello, Sarah.</h1>
                </div>
                <button onClick={onLogout} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors border border-white/10">
                    <LogOut size={18} />
                </button>
            </div>
            {activeTab === 'HOME' && (
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-[24px] flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-[10px] text-indigo-200 uppercase font-bold mb-1 tracking-wide">Net Salary</p>
                        <h2 className="text-3xl font-bold tracking-tight">${MOCK_SALARY.total.toLocaleString()}</h2>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                        <DollarSign size={24} />
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
                        <div className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-100">
                             <div className="flex justify-between items-center mb-6 px-1">
                                <h3 className="font-bold text-slate-900 text-lg">Class Attendance</h3>
                                <button className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">Mark All Present</button>
                             </div>
                             <div className="space-y-3">
                                {attendance.map(s => (
                                    <div key={s.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-2xl transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl ${s.avatarColor} flex items-center justify-center font-bold text-lg`}>{s.name[0]}</div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{s.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Roll: {s.rollNo}</p>
                                            </div>
                                        </div>
                                        <button className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                            s.status === 'PRESENT' 
                                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                                            : 'border-slate-200 text-slate-300'
                                        }`}>
                                            <CheckCircle size={16} fill={s.status === 'PRESENT' ? 'currentColor' : 'none'} />
                                        </button>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                );
            case 'PLANNER':
                return (
                    <div className="space-y-4 pb-24">
                        <h3 className="font-bold text-slate-900 text-lg px-2">Today's Schedule</h3>
                        <div className="space-y-4">
                            {lessons.map((l, idx) => (
                                <div key={l.id} className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-100 flex gap-5 items-center relative overflow-hidden group">
                                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                                    <div className={`w-16 h-16 rounded-[20px] ${l.color} flex items-center justify-center text-2xl shrink-0 shadow-inner`}>
                                        {l.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-900 text-lg">{l.subject}</h4>
                                        <p className="text-sm text-slate-500 mb-2 font-medium">{l.topic}</p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                                <Clock size={12} /> {l.time}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                                                <MapPin size={12} /> Rm {l.classRoom}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'ASSIGNMENTS':
                return (
                    <div className="space-y-6 pb-24">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="font-bold text-slate-900 text-lg">Active Tasks</h3>
                            <button className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-300 hover:scale-105 transition-transform">
                                <Plus size={20} />
                            </button>
                        </div>
                        {assignments.map((assign, idx) => (
                            <div key={assign.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 relative overflow-hidden">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide ${assign.color}`}>{assign.subject}</span>
                                    <div className="text-right">
                                        <span className="block text-xl font-bold text-slate-900">{assign.points}</span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase">Points</span>
                                    </div>
                                </div>
                                <h4 className="font-bold text-slate-800 text-lg mb-6">{assign.title}</h4>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-500">
                                        <span>Progress</span>
                                        <span>{assign.submitted}/{assign.total}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-slate-900 h-full rounded-full" 
                                            style={{ width: `${(assign.submitted / assign.total) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'GRADING':
                return (
                    <div className="space-y-4 pb-24">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-bold text-slate-900 text-lg">Submissions</h3>
                            <div className="flex gap-2">
                                {isSelectionMode ? (
                                    <button 
                                        onClick={() => {
                                            setIsSelectionMode(false);
                                            setSelectedIds([]);
                                        }}
                                        className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => setIsSelectionMode(true)}
                                        className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                                    >
                                        Select
                                    </button>
                                )}
                                {!isSelectionMode && (
                                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-100">
                                        {submissions.filter(s => s.status === 'PENDING').length} Pending
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {submissions.map((sub, idx) => (
                                <button 
                                    key={sub.id} 
                                    onClick={() => isSelectionMode ? toggleSelection(sub.id) : openGradingModal(sub)}
                                    className={`w-full bg-white p-4 rounded-[24px] shadow-sm border flex items-center justify-between active:scale-[0.98] transition-all text-left group ${
                                        isSelectionMode && selectedIds.includes(sub.id) ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/10' : 'border-slate-100 hover:shadow-md'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        {isSelectionMode ? (
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                                                selectedIds.includes(sub.id) ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-300'
                                            }`}>
                                                {selectedIds.includes(sub.id) ? <Check size={20} /> : <Square size={20} className="fill-white" />}
                                            </div>
                                        ) : (
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${
                                                sub.status === 'GRADED' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                                {sub.studentName.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <h4 className={`font-bold text-sm mb-0.5 ${selectedIds.includes(sub.id) && isSelectionMode ? 'text-indigo-900' : 'text-slate-900'}`}>{sub.studentName}</h4>
                                            <p className="text-xs text-slate-400 font-medium truncate max-w-[150px]">{sub.title}</p>
                                        </div>
                                    </div>
                                    
                                    {!isSelectionMode && (
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                            sub.status === 'GRADED' ? 'border-emerald-500 text-emerald-500' : 'border-slate-200 text-slate-300'
                                        }`}>
                                            <CheckCircle size={16} fill={sub.status === 'GRADED' ? 'currentColor' : 'none'} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="h-full flex flex-col bg-slate-50 relative animate-in fade-in duration-500">
            {renderHeader()}
            
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                {renderContent()}
            </div>
            
            {/* Planner FAB */}
            {activeTab === 'PLANNER' && (
                <button 
                    onClick={handleAddLesson}
                    className="absolute bottom-28 right-6 w-14 h-14 bg-slate-900 text-white rounded-[20px] flex items-center justify-center shadow-2xl shadow-slate-400 active:scale-90 transition-all z-30"
                >
                    <Plus size={24} />
                </button>
            )}

            {/* Bulk Action Bar */}
            {isSelectionMode && (
                <div className="absolute bottom-6 left-6 right-6 z-30 animate-in slide-in-from-bottom duration-300">
                    <button 
                        onClick={openBulkModal}
                        disabled={selectedIds.length === 0}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-[24px] shadow-2xl shadow-slate-400 flex items-center justify-center gap-2 disabled:opacity-70 disabled:translate-y-24 transition-all"
                    >
                        <Layers size={20} />
                        Grade {selectedIds.length} Selected
                    </button>
                </div>
            )}

            {/* Individual Grading Modal */}
            {selectedSubmission && (
                <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full h-[90%] sm:h-auto sm:max-h-[85vh] rounded-t-[40px] sm:rounded-[40px] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden m-0 sm:m-4">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div>
                                <h3 className="font-bold text-slate-900 text-xl">Grading</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mt-1">{selectedSubmission.title}</p>
                            </div>
                            <button onClick={() => setSelectedSubmission(null)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-[20px] bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xl">
                                    {selectedSubmission.studentName.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-lg">{selectedSubmission.studentName}</p>
                                    <p className="text-xs text-slate-400 font-bold uppercase">Student</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <FileText size={16} />
                                        <span className="text-xs font-bold uppercase tracking-wide">Submission</span>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">
                                        {selectedSubmission.date} • {selectedSubmission.time}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed font-medium">"{selectedSubmission.content}"</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1 block mb-2">Numerical Grade (0-100)</label>
                                    <input 
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={gradeInput}
                                        onChange={(e) => setGradeInput(e.target.value)}
                                        placeholder="Enter points (e.g. 95)"
                                        className="w-full p-4 bg-white border border-slate-200 rounded-[20px] focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-slate-900 text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1 block mb-2">Feedback</label>
                                    <textarea 
                                        value={feedbackInput}
                                        onChange={(e) => setFeedbackInput(e.target.value)}
                                        placeholder="Add comment..."
                                        className="w-full p-4 bg-white border border-slate-200 rounded-[20px] focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all text-sm h-32 resize-none font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-100 bg-white z-10">
                            <button 
                                onClick={handleSaveGrade}
                                className="w-full py-4 bg-slate-900 hover:bg-black text-white font-bold text-lg rounded-[24px] shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                Submit Result
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Grading Modal */}
            {showBulkModal && (
                <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full h-[80%] sm:h-auto sm:max-h-[85vh] rounded-t-[40px] sm:rounded-[40px] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden m-0 sm:m-4">
                        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div>
                                <h3 className="font-bold text-slate-900 text-xl">Bulk Action</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mt-1">{selectedIds.length} submissions selected</p>
                            </div>
                            <button onClick={() => setShowBulkModal(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white">
                            <div className="bg-indigo-50 p-6 rounded-[24px] border border-indigo-100 flex items-start gap-4">
                                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                                    <Layers size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-indigo-900 mb-1">Batch Update</h4>
                                    <p className="text-xs text-indigo-600/80 leading-relaxed font-medium">
                                        You are about to update {selectedIds.length} students. Any feedback or grade entered below will be applied to all selected submissions. Leaving fields empty will only mark them as 'Graded'.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1 block mb-2">Common Grade (Optional)</label>
                                    <input 
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={gradeInput}
                                        onChange={(e) => setGradeInput(e.target.value)}
                                        placeholder="Points (e.g. 100)"
                                        className="w-full p-4 bg-white border border-slate-200 rounded-[20px] focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-slate-900 text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1 block mb-2">Common Feedback (Optional)</label>
                                    <textarea 
                                        value={feedbackInput}
                                        onChange={(e) => setFeedbackInput(e.target.value)}
                                        placeholder="e.g. Great job everyone!"
                                        className="w-full p-4 bg-white border border-slate-200 rounded-[20px] focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all text-sm h-32 resize-none font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 border-t border-slate-100 bg-white z-10">
                            <button 
                                onClick={handleBulkSave}
                                className="w-full py-4 bg-slate-900 hover:bg-black text-white font-bold text-lg rounded-[24px] shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                Apply Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modern Floating Dock Navigation - Hidden in Selection Mode */}
            {!isSelectionMode && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
                    <div className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl shadow-slate-300/50 rounded-full p-2 flex items-center gap-1">
                        {[
                            { id: 'HOME', icon: Home },
                            { id: 'PLANNER', icon: Calendar },
                            { id: 'ASSIGNMENTS', icon: ClipboardList },
                            { id: 'GRADING', icon: GraduationCap }
                        ].map((tab) => (
                            <button 
                                key={tab.id} 
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                    activeTab === tab.id 
                                    ? 'bg-slate-900 text-white shadow-lg transform -translate-y-1' 
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <tab.icon size={20} strokeWidth={2.5} />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};