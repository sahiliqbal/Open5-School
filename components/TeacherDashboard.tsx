import React, { useState, useRef, useEffect } from 'react';
import { MOCK_ATTENDANCE, MOCK_SALARY } from '../constants';
import { LogOut, CheckCircle, XCircle, Clock, DollarSign, Calendar, MapPin, Plus, X, BookOpen, Star, Users, ChevronRight, ChevronLeft, UserCog, Sparkles, ShieldCheck, CalendarX, UserX, StickyNote, Trophy, Home, ClipboardList, GraduationCap, FileText, Search, Filter, MoreHorizontal, Check } from 'lucide-react';

interface TeacherDashboardProps {
    onLogout: () => void;
}

interface Lesson {
    id: string;
    time: string;
    subject: string;
    topic: string;
    classRoom: string;
    icon: string;
    notes: string;
    color: string;
    date?: number;
}

interface Assignment {
    id: string;
    title: string;
    subject: string;
    class: string;
    dueDate: string;
    submittedCount: number;
    totalStudents: number;
    status: 'Active' | 'Draft' | 'Closed';
    color: string;
}

interface Submission {
    id: string;
    studentName: string;
    avatarColor: string;
    assignmentTitle: string;
    submittedDate: string;
    status: 'Pending' | 'Graded';
    grade?: number;
    feedback?: string;
}

type Tab = 'HOME' | 'PLANNER' | 'ASSIGNMENTS' | 'GRADING';

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<Tab>('HOME');

    // --- State: Attendance ---
    const [attendance, setAttendance] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('open5_attendance');
            if (saved) return JSON.parse(saved);
        }
        return MOCK_ATTENDANCE;
    });

    // --- State: Lessons/Planner ---
    const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    const [lessons, setLessons] = useState<Lesson[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('open5_lessons');
            if (saved) return JSON.parse(saved);
        }
        return [
            { 
                id: '1', time: '09:00 AM', subject: 'Mathematics', topic: 'Calculus Derivatives', 
                classRoom: '10-B • Room 302', icon: '📐', notes: 'Bring graph paper and scientific calculators.',
                color: 'bg-indigo-50', date: new Date().getDate()
            },
            { 
                id: '2', time: '11:30 AM', subject: 'Physics', topic: 'Laws of Motion', 
                classRoom: '11-A • Lab 2', icon: '⚡', notes: 'Lab experiment setup required. Check safety goggles.',
                color: 'bg-orange-50', date: new Date().getDate()
            }
        ];
    });
    const [newLesson, setNewLesson] = useState<Partial<Lesson>>({
        time: '', subject: '', topic: '', classRoom: '', notes: ''
    });

    // --- State: Assignments ---
    const [assignments, setAssignments] = useState<Assignment[]>([
        { id: 'a1', title: 'Algebra Problem Set 3', subject: 'Mathematics', class: '10-B', dueDate: 'Feb 28, 2024', submittedCount: 18, totalStudents: 30, status: 'Active', color: 'bg-indigo-50 text-indigo-600' },
        { id: 'a2', title: 'Physics Lab Report', subject: 'Physics', class: '11-A', dueDate: 'Mar 02, 2024', submittedCount: 5, totalStudents: 28, status: 'Active', color: 'bg-orange-50 text-orange-600' },
        { id: 'a3', title: 'Calculus Quiz Prep', subject: 'Mathematics', class: '12-A', dueDate: 'Feb 25, 2024', submittedCount: 28, totalStudents: 28, status: 'Closed', color: 'bg-emerald-50 text-emerald-600' },
    ]);
    const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false);
    const [newAssignment, setNewAssignment] = useState<Partial<Assignment>>({
        title: '', subject: '', class: '', dueDate: ''
    });

    // --- State: Grading ---
    const [submissions, setSubmissions] = useState<Submission[]>([
        { id: 's1', studentName: 'Alice Johnson', avatarColor: 'bg-pink-100 text-pink-600', assignmentTitle: 'Algebra Problem Set 3', submittedDate: 'Today, 09:30 AM', status: 'Pending' },
        { id: 's2', studentName: 'Bob Smith', avatarColor: 'bg-blue-100 text-blue-600', assignmentTitle: 'Algebra Problem Set 3', submittedDate: 'Today, 10:15 AM', status: 'Pending' },
        { id: 's3', studentName: 'Charlie Brown', avatarColor: 'bg-yellow-100 text-yellow-600', assignmentTitle: 'Physics Lab Report', submittedDate: 'Yesterday, 04:00 PM', status: 'Graded', grade: 88, feedback: 'Good work on the hypothesis.' },
        { id: 's4', studentName: 'Daisy Miller', avatarColor: 'bg-purple-100 text-purple-600', assignmentTitle: 'Algebra Problem Set 3', submittedDate: 'Today, 08:00 AM', status: 'Pending' },
    ]);
    const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
    const [gradeInput, setGradeInput] = useState('');
    const [feedbackInput, setFeedbackInput] = useState('');

    // --- State: Proxies ---
    const [suggestedProxies, setSuggestedProxies] = useState([
        { id: 'p1', name: 'Mr. David Cohen', subject: 'Mathematics', match: 98, status: 'AVAILABLE', avatarColor: 'bg-indigo-100 text-indigo-600' },
        { id: 'p2', name: 'Ms. Emily Stone', subject: 'Physics', match: 85, status: 'BUSY', avatarColor: 'bg-pink-100 text-pink-600' },
        { id: 'p3', name: 'Mr. Robert Fox', subject: 'Statistics', match: 92, status: 'AVAILABLE', avatarColor: 'bg-cyan-100 text-cyan-600' },
    ]);

    // --- Persistence Effects ---
    useEffect(() => {
        localStorage.setItem('open5_attendance', JSON.stringify(attendance));
    }, [attendance]);

    useEffect(() => {
        localStorage.setItem('open5_lessons', JSON.stringify(lessons));
    }, [lessons]);


    // --- Helpers: Calendar ---
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); 
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(i);
        return days;
    };
    const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

    // --- Handlers ---
    const handleAddLesson = () => {
        if (!newLesson.subject || !newLesson.time) return;
        const lesson: Lesson = {
            id: Date.now().toString(),
            time: newLesson.time || '12:00 PM',
            subject: newLesson.subject || 'General',
            topic: newLesson.topic || 'Class Session',
            classRoom: newLesson.classRoom || 'Room 101',
            notes: newLesson.notes || '',
            icon: '📚',
            color: 'bg-blue-50',
            date: selectedDate
        };
        setLessons([...lessons, lesson]);
        setNewLesson({ time: '', subject: '', topic: '', classRoom: '', notes: '' });
        setIsAddLessonOpen(false);
    };

    const handleCreateAssignment = () => {
        if (!newAssignment.title || !newAssignment.class) return;
        const assignment: Assignment = {
            id: Date.now().toString(),
            title: newAssignment.title!,
            subject: newAssignment.subject || 'General',
            class: newAssignment.class!,
            dueDate: newAssignment.dueDate || 'No Due Date',
            submittedCount: 0,
            totalStudents: 30, // Mock
            status: 'Active',
            color: 'bg-indigo-50 text-indigo-600'
        };
        setAssignments([assignment, ...assignments]);
        setNewAssignment({ title: '', subject: '', class: '', dueDate: '' });
        setIsCreateAssignmentOpen(false);
    };

    const handleSubmitGrade = () => {
        if (!gradingSubmission) return;
        setSubmissions(prev => prev.map(sub => {
            if (sub.id === gradingSubmission.id) {
                return { ...sub, status: 'Graded', grade: Number(gradeInput), feedback: feedbackInput };
            }
            return sub;
        }));
        setGradingSubmission(null);
        setGradeInput('');
        setFeedbackInput('');
    };

    // Attendance toggles
    const toggleAttendance = (id: string) => {
        setAttendance(prev => prev.map(student => {
            if (student.id === id) {
                if (student.status === 'PRESENT') return { ...student, status: 'ABSENT' };
                if (student.status === 'ABSENT') return { ...student, status: 'LATE' };
                return { ...student, status: 'PRESENT' };
            }
            return student;
        }));
    };
    const markAllPresent = () => setAttendance(prev => prev.map(s => ({ ...s, status: 'PRESENT' })));
    const markAllAbsent = () => setAttendance(prev => prev.map(s => ({ ...s, status: 'ABSENT' })));
    const awardPoint = (id: string) => {
        setAttendance(prev => prev.map(s => s.id === id ? { ...s, behaviorPoints: (s.behaviorPoints || 0) + 1 } : s));
    };

    // Calculate Top Student
    const topStudent = attendance.reduce((prev, current) => ((prev.behaviorPoints || 0) > (current.behaviorPoints || 0)) ? prev : current, attendance[0]);

    // --- Render Functions ---

    const renderHeader = () => (
        <div className="px-5 pt-12 pb-8 sm:px-6 sm:pt-14 sm:pb-10 bg-gradient-to-br from-[#5D8BF4] to-[#8FAEFF] rounded-b-[40px] shadow-[0_20px_40px_-15px_rgba(93,139,244,0.3)] z-10 text-white relative overflow-hidden flex-shrink-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="flex justify-between items-start mb-6 sm:mb-8 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2 opacity-90">
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border border-white/10 shadow-sm">Teacher Portal</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold mt-1 leading-tight drop-shadow-sm">Hello,<br/>Ms. Sarah 👩‍🏫</h1>
                </div>
                <button onClick={onLogout} className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white/30 transition-all active:scale-90 shadow-lg border border-white/10 group touch-manipulation">
                    <LogOut size={18} className="text-white group-hover:text-red-100 transition-colors sm:w-5 sm:h-5" />
                </button>
            </div>
            
            {/* Only show Salary on Home tab to save space */}
            {activeTab === 'HOME' && (
                <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-[30px] p-5 sm:p-6 flex items-center justify-between shadow-2xl shadow-blue-900/10 relative overflow-hidden group hover:bg-white/20 transition-all active:scale-[0.99] cursor-pointer select-none touch-manipulation">
                    <div className="relative z-10 min-w-0 flex-1">
                        <p className="text-[10px] sm:text-xs text-blue-50 uppercase tracking-wider font-bold mb-1">Available Salary</p>
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md truncate">${MOCK_SALARY.total.toLocaleString()}</h3>
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-black/10 px-2.5 py-1 rounded-lg backdrop-blur-sm border border-white/5 max-w-full">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)] flex-shrink-0"></div>
                            <p className="text-[10px] text-blue-50 font-medium truncate">Paid on {MOCK_SALARY.paymentDate}</p>
                        </div>
                    </div>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-white to-blue-50 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-12 transition-transform duration-300 relative z-10 flex-shrink-0 ml-3">
                        <DollarSign size={24} className="text-[#5D8BF4] sm:w-7 sm:h-7" />
                    </div>
                </div>
            )}
        </div>
    );

    const renderHome = () => (
        <div className="space-y-8">
            {/* Attendance Section */}
            <div>
                 <div className="flex justify-between items-center px-1 mb-4">
                    <div className="flex items-center gap-3">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                             Attendance <span className="text-slate-300 font-normal text-xs">({attendance.length})</span>
                        </h3>
                        {(topStudent?.behaviorPoints || 0) > 0 && (
                            <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-2 py-1 rounded-full shadow-sm">
                                <Trophy size={10} className="text-amber-500 fill-amber-500" />
                                <span className="text-[10px] font-bold text-amber-700">{topStudent.name}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                         <button onClick={markAllPresent} className="bg-blue-50 hover:bg-blue-100 text-[#5D8BF4] px-3 py-1.5 rounded-full text-xs font-bold transition-colors active:scale-95 flex items-center gap-1 border border-blue-100">
                            <Users size={12} /> All Present
                         </button>
                         <button onClick={markAllAbsent} className="bg-rose-50 hover:bg-rose-100 text-rose-500 px-3 py-1.5 rounded-full text-xs font-bold transition-colors active:scale-95 flex items-center gap-1 border border-rose-100">
                            <UserX size={12} /> Reset
                         </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {attendance.map((student) => {
                         let statusConfig = { bg: 'bg-slate-100', text: 'text-slate-500', icon: null, label: 'Unknown', border: 'border-slate-100' };
                         if (student.status === 'PRESENT') statusConfig = { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: <CheckCircle size={14}/>, label: 'Present', border: 'border-emerald-100' };
                         if (student.status === 'ABSENT') statusConfig = { bg: 'bg-rose-50', text: 'text-rose-600', icon: <XCircle size={14}/>, label: 'Absent', border: 'border-rose-100' };
                         if (student.status === 'LATE') statusConfig = { bg: 'bg-amber-50', text: 'text-amber-600', icon: <Clock size={14}/>, label: 'Late', border: 'border-amber-100' };

                        return (
                            <div key={student.id} onClick={() => toggleAttendance(student.id)} className={`p-3 rounded-[24px] bg-white shadow-sm flex items-center justify-between border border-slate-50 active:scale-[0.99] transition-all cursor-pointer hover:shadow-md`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-2xl ${student.avatarColor} flex items-center justify-center font-bold text-lg shadow-inner`}>{student.name.charAt(0)}</div>
                                    <div>
                                        <h4 className="font-bold text-slate-700 text-sm">{student.name}</h4>
                                        <p className="text-[10px] text-slate-400 font-medium">#{student.rollNo}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); awardPoint(student.id); }} className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100 active:scale-90 transition-transform relative hover:bg-amber-100">
                                        <Star size={16} fill="currentColor" />
                                        <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">{student.behaviorPoints || 0}</div>
                                    </button>
                                    <div className={`h-9 px-3 rounded-xl flex items-center gap-1.5 text-[10px] font-bold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                                        {statusConfig.icon} {statusConfig.label}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

             {/* Proxy Section */}
             <div className="pb-24">
                 <div className="flex items-center gap-3 px-1 mb-4 mt-8">
                     <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 border border-purple-100">
                         <UserCog size={20} />
                     </div>
                     <h3 className="font-bold text-slate-800 text-lg">Proxy Suggestions</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {suggestedProxies.map((proxy) => (
                        <div key={proxy.id} className="flex items-center justify-between p-4 rounded-[24px] bg-white shadow-sm border border-slate-50">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-[18px] ${proxy.avatarColor} flex items-center justify-center font-bold text-lg`}>{proxy.name.charAt(4)}</div>
                                <div>
                                    <h5 className="font-bold text-slate-800 text-sm">{proxy.name}</h5>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className={`w-1.5 h-1.5 rounded-full ${proxy.status === 'AVAILABLE' ? 'bg-emerald-400' : 'bg-orange-400'}`}></span>
                                        <span className="text-[10px] text-slate-400 font-medium">{proxy.status} • {proxy.match}% Match</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => alert("Request Sent")} className="text-[10px] font-bold text-white bg-slate-800 px-4 py-2 rounded-xl active:scale-95 transition-transform">Request</button>
                        </div>
                    ))}
                 </div>
             </div>
        </div>
    );

    const renderPlanner = () => {
        const calendarGrid = getDaysInMonth(currentMonth);
        const displayedLessons = lessons.filter(l => l.date === selectedDate);

        return (
            <div className="space-y-6 pb-24">
                <div className="flex justify-between items-center px-1">
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><Calendar size={20} className="text-[#5D8BF4]"/> Lesson Plan</h3>
                    <button onClick={() => setIsAddLessonOpen(true)} className="bg-[#5D8BF4] hover:bg-indigo-600 text-white p-2.5 px-4 rounded-xl shadow-lg shadow-blue-200/50 active:scale-95 transition-all flex items-center gap-2">
                        <Plus size={18} strokeWidth={3} /> <span className="text-xs font-bold">New Lesson</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Calendar Widget */}
                    <div className="bg-white rounded-[32px] p-5 shadow-sm border border-slate-50 h-fit">
                        <div className="flex items-center justify-between mb-4">
                            <button onClick={handlePrevMonth} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"><ChevronLeft size={18} /></button>
                            <h4 className="font-bold text-slate-800 text-lg">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
                            <button onClick={handleNextMonth} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"><ChevronRight size={18} /></button>
                        </div>
                        <div className="grid grid-cols-7 mb-2 text-center">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-[10px] font-bold text-slate-400">{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {calendarGrid.map((day, idx) => {
                                if (day === null) return <div key={`empty-${idx}`} />;
                                const isSelected = selectedDate === day;
                                const hasLesson = lessons.some(l => l.date === day);
                                return (
                                    <button key={day} onClick={() => setSelectedDate(day as number)} className={`aspect-square rounded-[18px] flex flex-col items-center justify-center relative transition-all ${isSelected ? 'bg-[#5D8BF4] text-white shadow-lg shadow-blue-200' : 'hover:bg-slate-50 text-slate-600'}`}>
                                        <span className={`text-sm ${isSelected ? 'font-bold' : 'font-medium'}`}>{day}</span>
                                        {(hasLesson || isSelected) && <div className={`w-1 h-1 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-orange-400'}`}></div>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Lessons List */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-500 px-2">Schedule for {currentMonth.toLocaleDateString('en-US', { month: 'short' })} {selectedDate}</h4>
                        {displayedLessons.length === 0 ? (
                            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[32px] p-8 flex flex-col items-center justify-center text-center h-64">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-3"><CalendarX size={24} /></div>
                                <p className="text-slate-400 text-sm font-medium">No lessons planned.</p>
                            </div>
                        ) : (
                            displayedLessons.map((lesson) => (
                                <div key={lesson.id} className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-50 relative overflow-hidden group hover:shadow-md transition-all">
                                    <div className={`absolute right-0 top-0 w-24 h-24 ${lesson.color} rounded-bl-[40px] -mr-6 -mt-6 opacity-60`}></div>
                                    <div className="flex justify-between items-start relative z-10 mb-3">
                                        <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-slate-100">
                                            <Clock size={12} className="text-slate-400" /> {lesson.time}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-4 relative z-10">
                                        <div className={`w-12 h-12 ${lesson.color} rounded-[20px] flex items-center justify-center text-xl shadow-sm ring-4 ring-white`}>{lesson.icon}</div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-base leading-tight mb-1">{lesson.subject}</h4>
                                            <p className="text-slate-500 text-xs font-medium">{lesson.topic}</p>
                                            {lesson.notes && (
                                                <div className="mt-3 bg-[#FFF8E1] p-2.5 rounded-xl border border-amber-100 flex items-start gap-2">
                                                    <StickyNote size={12} className="text-amber-400 mt-0.5 flex-shrink-0" />
                                                    <p className="text-[10px] text-slate-600 font-medium leading-relaxed">{lesson.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderAssignments = () => (
        <div className="space-y-6 pb-24">
            <div className="flex justify-between items-center px-1">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><ClipboardList size={20} className="text-[#5D8BF4]"/> Assignments</h3>
                <button onClick={() => setIsCreateAssignmentOpen(true)} className="bg-[#5D8BF4] hover:bg-indigo-600 text-white p-2.5 px-4 rounded-xl shadow-lg shadow-blue-200/50 active:scale-95 transition-all flex items-center gap-2">
                    <Plus size={18} strokeWidth={3} /> <span className="text-xs font-bold">Create</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignments.map(assign => (
                    <div key={assign.id} className="bg-white p-5 rounded-[32px] shadow-sm border border-slate-50 group hover:shadow-md transition-all">
                         <div className="flex justify-between items-start mb-4">
                             <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-[20px] ${assign.color} bg-opacity-10 flex items-center justify-center text-xl`}>
                                    <FileText size={24} className={assign.color.split(' ')[1]} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{assign.title}</h4>
                                    <p className="text-xs text-slate-400 font-medium">{assign.subject} • {assign.class}</p>
                                </div>
                             </div>
                             <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                                 assign.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                                 assign.status === 'Closed' ? 'bg-slate-100 text-slate-500' : 'bg-amber-50 text-amber-600'
                             }`}>
                                 {assign.status}
                             </span>
                         </div>
                         
                         <div className="bg-slate-50 rounded-2xl p-3 flex justify-between items-center text-xs border border-slate-100">
                             <div>
                                 <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Due Date</p>
                                 <p className="font-bold text-slate-700">{assign.dueDate}</p>
                             </div>
                             <div className="text-right">
                                 <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Submissions</p>
                                 <p className="font-bold text-[#5D8BF4]">{assign.submittedCount} <span className="text-slate-400">/ {assign.totalStudents}</span></p>
                             </div>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderGrading = () => {
        const pendingCount = submissions.filter(s => s.status === 'Pending').length;

        return (
            <div className="space-y-6 pb-24">
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Submissions</h3>
                        <p className="text-xs text-slate-400 font-medium">Review and grade student work</p>
                    </div>
                    <div className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-xl text-xs font-bold border border-orange-100">
                        {pendingCount} Pending
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {submissions.map((sub) => (
                        <div key={sub.id} className="bg-white p-4 rounded-[28px] shadow-sm border border-slate-50 relative overflow-hidden">
                             <div className="flex items-center justify-between mb-3">
                                 <div className="flex items-center gap-3">
                                     <div className={`w-10 h-10 rounded-xl ${sub.avatarColor} flex items-center justify-center font-bold`}>{sub.studentName.charAt(0)}</div>
                                     <div>
                                         <h4 className="font-bold text-slate-800 text-sm">{sub.studentName}</h4>
                                         <p className="text-[10px] text-slate-400 font-medium">{sub.assignmentTitle}</p>
                                     </div>
                                 </div>
                                 {sub.status === 'Graded' ? (
                                     <div className="text-right">
                                         <span className="text-xl font-bold text-emerald-600">{sub.grade}</span>
                                         <p className="text-[9px] text-slate-400 font-bold uppercase">Score</p>
                                     </div>
                                 ) : (
                                     <button 
                                        onClick={() => setGradingSubmission(sub)}
                                        className="bg-[#5D8BF4] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-100 active:scale-95 transition-transform"
                                     >
                                         Grade
                                     </button>
                                 )}
                             </div>
                             
                             {sub.status === 'Graded' && sub.feedback && (
                                 <div className="bg-slate-50 p-3 rounded-xl text-[10px] text-slate-500 italic border border-slate-100">
                                     "{sub.feedback}"
                                 </div>
                             )}
                             <div className="mt-2 text-[10px] text-slate-400 font-medium text-right">
                                 Submitted: {sub.submittedDate}
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans relative overflow-hidden">
            {/* Background decoration */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-20%] w-[300px] h-[300px] bg-blue-100/40 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[10%] left-[-10%] w-[250px] h-[250px] bg-orange-100/40 rounded-full blur-[80px]"></div>
            </div>

            {renderHeader()}

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-6 space-y-8 relative z-10 no-scrollbar touch-pan-y">
                {activeTab === 'HOME' && renderHome()}
                {activeTab === 'PLANNER' && renderPlanner()}
                {activeTab === 'ASSIGNMENTS' && renderAssignments()}
                {activeTab === 'GRADING' && renderGrading()}
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur-xl py-3 px-6 rounded-t-[30px] sm:rounded-full sm:bottom-4 sm:shadow-2xl sm:border border-slate-100 shadow-[0_-5px_30px_-5px_rgba(0,0,0,0.05)] z-40 transition-all">
                <div className="flex items-center justify-between">
                    {[
                        { id: 'HOME', icon: Home, label: 'Overview' },
                        { id: 'PLANNER', icon: Calendar, label: 'Planner' },
                        { id: 'ASSIGNMENTS', icon: ClipboardList, label: 'Assign' },
                        { id: 'GRADING', icon: GraduationCap, label: 'Grade' },
                    ].map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => setActiveTab(item.id as Tab)}
                            className={`flex flex-col items-center gap-1 w-16 p-1 rounded-2xl transition-all duration-300 ${activeTab === item.id ? 'text-[#5D8BF4]' : 'text-slate-300 hover:text-slate-400'}`}
                        >
                            <div className={`p-1.5 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-50 scale-110 shadow-sm' : 'bg-transparent'}`}>
                                <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                            </div>
                            <span className={`text-[9px] font-bold transition-all ${activeTab === item.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 hidden'}`}>{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Modal: Add Lesson */}
            {isAddLessonOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white w-full sm:max-w-md rounded-t-[40px] sm:rounded-[40px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 pb-10">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 opacity-80"></div>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Add Lesson</h2>
                        <div className="space-y-4">
                             <input type="text" placeholder="Subject (e.g. Math)" value={newLesson.subject} onChange={e => setNewLesson({...newLesson, subject: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:border-[#5D8BF4]" />
                             <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Time" value={newLesson.time} onChange={e => setNewLesson({...newLesson, time: e.target.value})} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:border-[#5D8BF4]" />
                                <input type="text" placeholder="Room" value={newLesson.classRoom} onChange={e => setNewLesson({...newLesson, classRoom: e.target.value})} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:border-[#5D8BF4]" />
                             </div>
                             <input type="text" placeholder="Topic" value={newLesson.topic} onChange={e => setNewLesson({...newLesson, topic: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:border-[#5D8BF4]" />
                             <textarea placeholder="Notes..." value={newLesson.notes} onChange={e => setNewLesson({...newLesson, notes: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 h-24 resize-none focus:outline-none focus:border-[#5D8BF4]" />
                             <div className="flex gap-3">
                                 <button onClick={() => setIsAddLessonOpen(false)} className="flex-1 py-4 text-slate-500 font-bold bg-slate-100 rounded-2xl">Cancel</button>
                                 <button onClick={handleAddLesson} className="flex-1 py-4 text-white font-bold bg-[#5D8BF4] rounded-2xl shadow-lg">Add</button>
                             </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Create Assignment */}
            {isCreateAssignmentOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white w-full sm:max-w-md rounded-t-[40px] sm:rounded-[40px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 pb-10">
                         <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 opacity-80"></div>
                         <h2 className="text-xl font-bold text-slate-800 mb-4">New Assignment</h2>
                         <div className="space-y-4">
                             <input type="text" placeholder="Title" value={newAssignment.title} onChange={e => setNewAssignment({...newAssignment, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:border-[#5D8BF4]" />
                             <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Class (e.g. 10-A)" value={newAssignment.class} onChange={e => setNewAssignment({...newAssignment, class: e.target.value})} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:border-[#5D8BF4]" />
                                <input type="text" placeholder="Subject" value={newAssignment.subject} onChange={e => setNewAssignment({...newAssignment, subject: e.target.value})} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:border-[#5D8BF4]" />
                             </div>
                             <input type="text" placeholder="Due Date" value={newAssignment.dueDate} onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:outline-none focus:border-[#5D8BF4]" />
                             <div className="flex gap-3">
                                 <button onClick={() => setIsCreateAssignmentOpen(false)} className="flex-1 py-4 text-slate-500 font-bold bg-slate-100 rounded-2xl">Cancel</button>
                                 <button onClick={handleCreateAssignment} className="flex-1 py-4 text-white font-bold bg-[#5D8BF4] rounded-2xl shadow-lg">Create</button>
                             </div>
                         </div>
                    </div>
                </div>
            )}

            {/* Modal: Grade Submission */}
            {gradingSubmission && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white w-full sm:max-w-md rounded-t-[40px] sm:rounded-[40px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 pb-10">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 opacity-80"></div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-14 h-14 rounded-2xl ${gradingSubmission.avatarColor} flex items-center justify-center font-bold text-xl`}>{gradingSubmission.studentName.charAt(0)}</div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">{gradingSubmission.studentName}</h2>
                                <p className="text-sm text-slate-500">{gradingSubmission.assignmentTitle}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Grade (0-100)</label>
                                <input type="number" placeholder="Enter Score" value={gradeInput} onChange={e => setGradeInput(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-lg font-bold text-slate-800 focus:outline-none focus:border-[#5D8BF4]" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Feedback</label>
                                <textarea placeholder="Write feedback..." value={feedbackInput} onChange={e => setFeedbackInput(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 h-24 resize-none focus:outline-none focus:border-[#5D8BF4]" />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setGradingSubmission(null)} className="flex-1 py-4 text-slate-500 font-bold bg-slate-100 rounded-2xl">Cancel</button>
                                <button onClick={handleSubmitGrade} className="flex-1 py-4 text-white font-bold bg-[#5D8BF4] rounded-2xl shadow-lg">Submit Grade</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};