import React, { useState } from 'react';
import { LogOut, Bell, Home, PieChart, Users, Calendar, Package, Plus, UserCog, MessageSquare, BookOpen, Search, Filter, Ban, CheckCircle, Activity, Award, Mail, Phone, X, AlertTriangle, Clock, MapPin, KeyRound, GraduationCap, Edit3, BarChart3, Trash2, Save, UserPlus, TrendingUp, Info } from 'lucide-react';
import { MOCK_COURSES } from '../constants';

interface AdminDashboardProps {
    onLogout: () => void;
}

type Tab = 'DASHBOARD' | 'COURSES' | 'FINANCE' | 'EXAMS' | 'STUDENTS' | 'INVENTORY';

interface AttendanceRecord {
    date: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
}

interface SubjectGrade {
    subject: string;
    grade: string;
    score: number;
}

interface StudentProfile {
    id: string;
    name: string;
    rollNo: string;
    email: string;
    grade: string;
    section: string;
    status: 'ACTIVE' | 'SUSPENDED' | 'ALUMNI';
    gpa: number;
    attendance: number;
    avatarSeed: string;
    phone: string;
    parentName: string;
    address: string;
    enrollmentDate: string;
    attendanceHistory: AttendanceRecord[];
    performance: SubjectGrade[];
    suspensionReason?: string;
}

const MOCK_STUDENTS_DATA: StudentProfile[] = [
    { 
        id: '1', 
        name: 'Alex Johnson', 
        rollNo: '2451', 
        email: 'alex.j@school.edu', 
        grade: '12', 
        section: 'A', 
        status: 'ACTIVE', 
        gpa: 3.8, 
        attendance: 95, 
        avatarSeed: 'Alex', 
        phone: '+1 234 567 890', 
        parentName: 'Robert Johnson',
        address: '123 Academic Way, Springfield, IL',
        enrollmentDate: 'Aug 15, 2021',
        attendanceHistory: [
            { date: '2024-02-26', status: 'PRESENT' },
            { date: '2024-02-23', status: 'PRESENT' },
            { date: '2024-02-22', status: 'PRESENT' },
            { date: '2024-02-21', status: 'LATE' },
            { date: '2024-02-20', status: 'PRESENT' },
        ],
        performance: [
            { subject: 'Mathematics', grade: 'A', score: 94 },
            { subject: 'Physics', grade: 'A-', score: 89 },
            { subject: 'English', grade: 'B+', score: 87 },
            { subject: 'History', grade: 'A', score: 92 },
        ]
    },
    { 
        id: '2', 
        name: 'Sam Smith', 
        rollNo: '2452', 
        email: 'sam.s@school.edu', 
        grade: '11', 
        section: 'B', 
        status: 'SUSPENDED', 
        gpa: 2.4, 
        attendance: 60, 
        avatarSeed: 'Sam', 
        phone: '+1 987 654 321', 
        parentName: 'Mary Smith',
        address: '45 Oak Lane, Springfield, IL',
        enrollmentDate: 'Aug 20, 2022',
        attendanceHistory: [
            { date: '2024-02-26', status: 'ABSENT' },
            { date: '2024-02-23', status: 'ABSENT' },
            { date: '2024-02-22', status: 'LATE' },
        ],
        performance: [
            { subject: 'Mathematics', grade: 'C', score: 72 },
            { subject: 'Physics', grade: 'D', score: 64 },
            { subject: 'English', grade: 'B', score: 82 },
        ],
        suspensionReason: 'Frequent unauthorized absences and disruptive classroom behavior.'
    },
    { 
        id: '3', 
        name: 'Jordan Lee', 
        rollNo: '2453', 
        email: 'jordan.l@school.edu', 
        grade: '10', 
        section: 'A', 
        status: 'ACTIVE', 
        gpa: 3.9, 
        attendance: 98, 
        avatarSeed: 'Jordan', 
        phone: '+1 555 123 456', 
        parentName: 'David Lee',
        address: '88 Pine Street, Springfield, IL',
        enrollmentDate: 'Sep 01, 2023',
        attendanceHistory: [
            { date: '2024-02-26', status: 'PRESENT' },
            { date: '2024-02-23', status: 'PRESENT' },
        ],
        performance: [
            { subject: 'Mathematics', grade: 'A+', score: 98 },
            { subject: 'Biology', grade: 'A', score: 95 },
            { subject: 'Chemistry', grade: 'A', score: 94 },
        ]
    }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');
    
    // Student Module State
    const [students, setStudents] = useState<StudentProfile[]>(MOCK_STUDENTS_DATA);
    const [studentSearch, setStudentSearch] = useState('');
    const [studentFilter, setStudentFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED' | 'ALUMNI'>('ALL');
    const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
    const [showSuspendDialog, setShowSuspendDialog] = useState(false);
    const [suspensionInput, setSuspensionInput] = useState('');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Form state for adding a student
    const [newStudentForm, setNewStudentForm] = useState({
        name: '',
        rollNo: '',
        email: '',
        grade: '10',
        section: 'A',
        phone: '',
        parentName: '',
        address: ''
    });

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.rollNo.includes(studentSearch);
        const matchesFilter = studentFilter === 'ALL' || s.status === studentFilter;
        return matchesSearch && matchesFilter;
    });

    const triggerToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStudentForm.name || !newStudentForm.rollNo) return;

        const studentToAdd: StudentProfile = {
            id: Date.now().toString(),
            name: newStudentForm.name,
            rollNo: newStudentForm.rollNo,
            email: newStudentForm.email || `${newStudentForm.name.toLowerCase().replace(' ', '.')}@school.edu`,
            grade: newStudentForm.grade,
            section: newStudentForm.section,
            status: 'ACTIVE',
            gpa: 0,
            attendance: 0,
            avatarSeed: newStudentForm.name.split(' ')[0],
            phone: newStudentForm.phone,
            parentName: newStudentForm.parentName,
            address: newStudentForm.address,
            enrollmentDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            attendanceHistory: [],
            performance: []
        };

        setStudents(prev => [studentToAdd, ...prev]);
        setIsAddModalOpen(false);
        setNewStudentForm({
            name: '', rollNo: '', email: '', grade: '10', section: 'A', phone: '', parentName: '', address: ''
        });
        triggerToast(`Student ${studentToAdd.name} enrolled successfully!`);
    };

    const handleDeleteStudent = () => {
        if (!selectedStudent) return;
        setStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
        triggerToast(`${selectedStudent.name}'s record deleted permanently.`, 'error');
        setSelectedStudent(null);
        setShowDeleteDialog(false);
    };

    const handleSuspendStudent = () => {
        if (!selectedStudent || !suspensionInput.trim()) {
            triggerToast('Please provide a reason for suspension.', 'error');
            return;
        }
        const updatedStudents = students.map(s => 
            s.id === selectedStudent.id 
                ? { ...s, status: 'SUSPENDED' as const, suspensionReason: suspensionInput } 
                : s
        );
        setStudents(updatedStudents);
        setSelectedStudent({ ...selectedStudent, status: 'SUSPENDED', suspensionReason: suspensionInput });
        setShowSuspendDialog(false);
        setSuspensionInput('');
        triggerToast(`${selectedStudent.name} has been suspended.`);
    };

    const handleResetPassword = () => {
        triggerToast(`Password reset link sent to ${selectedStudent?.email}`);
    };

    const handlePromoteGrade = () => {
        if (!selectedStudent) return;
        const currentGrade = parseInt(selectedStudent.grade);
        const nextGrade = (currentGrade + 1).toString();
        setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, grade: nextGrade } : s));
        setSelectedStudent(prev => prev ? { ...prev, grade: nextGrade } : null);
        triggerToast(`${selectedStudent.name} promoted to Grade ${nextGrade}`);
    };

    const StatCard = ({ label, value, color, icon: Icon }: any) => (
        <div className={`p-5 rounded-[24px] ${color} text-white shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer`}>
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <p className="text-[10px] font-black uppercase opacity-70 tracking-widest">{label}</p>
                    {Icon && <Icon size={16} className="opacity-50" />}
                </div>
                <h3 className="text-2xl font-black">{value}</h3>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl transform translate-x-8 -translate-y-8 group-hover:scale-125 transition-transform"></div>
        </div>
    );

    const renderContent = () => {
        switch(activeTab) {
            case 'DASHBOARD':
                return (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard label="Total Students" value={students.length} color="bg-slate-900" icon={Users} />
                            <StatCard label="Active Teachers" value="62" color="bg-indigo-600" icon={UserCog} />
                            <StatCard label="Fee Revenue" value="$42,500" color="bg-emerald-500" icon={PieChart} />
                            <StatCard label="Pending Tasks" value="12" color="bg-orange-500" icon={Activity} />
                        </div>
                        
                        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Activity size={18} className="text-indigo-500" /> Administrative Hub
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: 'Broadcast', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-50' },
                                    { label: 'Timetable', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
                                    { label: 'Payroll', icon: PieChart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                    { label: 'Inventory', icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
                                    { label: 'Grades', icon: Award, color: 'text-pink-600', bg: 'bg-pink-50' },
                                    { label: 'Settings', icon: UserCog, color: 'text-slate-600', bg: 'bg-slate-50' },
                                ].map((action, i) => (
                                    <button key={i} className="flex flex-col items-center gap-2 group">
                                        <div className={`w-14 h-14 ${action.bg} ${action.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                                            <action.icon size={24} />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{action.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'STUDENTS':
                return (
                    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
                        <div className="sticky top-0 bg-slate-50 z-10 pb-2 space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="font-black text-slate-900 text-xl tracking-tight">Student Directory</h3>
                                <button 
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 active:scale-90 transition-transform"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                            
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Search name or roll no..." 
                                        value={studentSearch}
                                        onChange={(e) => setStudentSearch(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-[20px] py-3.5 pl-11 pr-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                                    />
                                </div>
                                <button className="w-12 h-12 bg-white border border-slate-200 rounded-[20px] flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm transition-colors">
                                    <Filter size={20} />
                                </button>
                            </div>

                            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                                {['ALL', 'ACTIVE', 'SUSPENDED', 'ALUMNI'].map((filter) => (
                                    <button 
                                        key={filter}
                                        onClick={() => setStudentFilter(filter as any)}
                                        className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                            studentFilter === filter 
                                            ? 'bg-slate-900 text-white shadow-md' 
                                            : 'bg-white text-slate-400 border border-slate-100'
                                        }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                            <div className="px-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                Found {filteredStudents.length} Students
                            </div>
                        </div>

                        <div className="space-y-3">
                            {filteredStudents.map((student) => (
                                <button 
                                    key={student.id} 
                                    onClick={() => setSelectedStudent(student)}
                                    className="w-full bg-white p-4 rounded-[28px] border border-slate-100 flex items-center justify-between group hover:shadow-xl hover:shadow-indigo-500/5 transition-all active:scale-[0.98] text-left"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-[20px] bg-slate-50 border border-slate-100 overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                                            <img 
                                                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${student.avatarSeed}`} 
                                                alt={student.name}
                                                className="w-full h-full"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-base">{student.name}</h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Roll: {student.rollNo}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">Grade {student.grade}-{student.section}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className={`w-2.5 h-2.5 rounded-full mb-1 ${
                                            student.status === 'ACTIVE' ? 'bg-emerald-500' :
                                            student.status === 'SUSPENDED' ? 'bg-red-500' : 'bg-slate-300'
                                        }`}></div>
                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{student.status}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 animate-in fade-in zoom-in duration-300">
                        <Package size={48} className="mb-4 opacity-50" />
                        <p className="font-black text-sm uppercase tracking-widest">In Development</p>
                    </div>
                );
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 relative">
            {/* Header */}
            <div className="px-6 py-6 bg-white border-b border-slate-100 z-10 shrink-0 sticky top-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                             <UserCog size={20} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Administration</p>
                            <h1 className="text-sm font-bold text-slate-900">Supt. Admin</h1>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm border border-slate-100 transition-colors"><Bell size={18}/></button>
                        <button onClick={onLogout} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"><LogOut size={18}/></button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6 pb-32 no-scrollbar">
                {renderContent()}
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-28 left-6 right-6 p-4 rounded-2xl shadow-xl border flex items-center gap-3 animate-in slide-in-from-bottom duration-300 z-[100] ${
                    toast.type === 'success' ? 'bg-emerald-900 border-emerald-800 text-white' : 'bg-red-900 border-red-800 text-white'
                }`}>
                    {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                    <span className="text-xs font-bold">{toast.message}</span>
                </div>
            )}

            {/* Add Student Modal */}
            {isAddModalOpen && (
                <div className="absolute inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-end sm:items-center justify-center animate-in fade-in duration-300">
                    <div className="bg-white w-full h-[90%] sm:h-auto sm:max-h-[85%] rounded-t-[40px] sm:rounded-[32px] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden">
                        <div className="px-8 pt-8 pb-4 flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">New Enrollment</h2>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Student Records</p>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"><X size={24}/></button>
                        </div>
                        
                        <form onSubmit={handleAddStudent} className="flex-1 overflow-y-auto px-8 pb-8 pt-4 space-y-6 no-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="John Smith"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                                        value={newStudentForm.name}
                                        onChange={e => setNewStudentForm({...newStudentForm, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Roll Number</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="2454"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                                        value={newStudentForm.rollNo}
                                        onChange={e => setNewStudentForm({...newStudentForm, rollNo: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</label>
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none"
                                        value={newStudentForm.grade}
                                        onChange={e => setNewStudentForm({...newStudentForm, grade: e.target.value})}
                                    >
                                        <option value="10">Grade 10</option>
                                        <option value="11">Grade 11</option>
                                        <option value="12">Grade 12</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section</label>
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none"
                                        value={newStudentForm.section}
                                        onChange={e => setNewStudentForm({...newStudentForm, section: e.target.value})}
                                    >
                                        <option value="A">Section A</option>
                                        <option value="B">Section B</option>
                                        <option value="C">Section C</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Guardian Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Parent / Guardian Full Name"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none"
                                    value={newStudentForm.parentName}
                                    onChange={e => setNewStudentForm({...newStudentForm, parentName: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Phone</label>
                                <input 
                                    type="tel" 
                                    placeholder="+1 000 000 000"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:outline-none"
                                    value={newStudentForm.phone}
                                    onChange={e => setNewStudentForm({...newStudentForm, phone: e.target.value})}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Residential Address</label>
                                <textarea 
                                    placeholder="Full home address..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium focus:outline-none h-24 resize-none"
                                    value={newStudentForm.address}
                                    onChange={e => setNewStudentForm({...newStudentForm, address: e.target.value})}
                                />
                            </div>

                            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                                <UserPlus size={22} />
                                Create Record
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Student Detail Modal */}
            {selectedStudent && (
                <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#F8F9FA] w-full h-[95%] sm:h-auto sm:max-h-[85vh] rounded-t-[44px] sm:rounded-[44px] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden relative">
                        {/* Interactive Hero Header */}
                        <div className="relative h-44 bg-slate-900 shrink-0 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/80 via-purple-600/80 to-slate-900/90 z-10"></div>
                            <button 
                                onClick={() => setSelectedStudent(null)} 
                                className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all z-30 border border-white/20 shadow-xl"
                            >
                                <X size={24} />
                            </button>
                            
                            <div className="absolute bottom-16 left-8 z-20 flex items-center gap-5">
                                <div className="w-24 h-24 bg-white p-1.5 rounded-[32px] shadow-2xl relative">
                                    <img 
                                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedStudent.avatarSeed}`} 
                                        alt={selectedStudent.name}
                                        className="w-full h-full bg-slate-50 rounded-[24px] object-cover"
                                    />
                                    <div className={`absolute -bottom-1 -right-1 w-8 h-8 border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg ${
                                        selectedStudent.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-500'
                                    }`}>
                                        {selectedStudent.status === 'ACTIVE' ? <CheckCircle size={14} /> : <Ban size={14} />}
                                    </div>
                                </div>
                                <div className="text-white">
                                    <h2 className="text-2xl font-black tracking-tight">{selectedStudent.name}</h2>
                                    <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mt-1">Roll ID: {selectedStudent.rollNo}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto bg-[#F8F9FA] relative -mt-8 rounded-t-[40px] z-20 pt-8 px-8 pb-32 no-scrollbar">
                            <div className="grid grid-cols-4 gap-3 mb-8">
                                {[
                                    { label: 'Promote', icon: GraduationCap, action: handlePromoteGrade, color: 'bg-white text-emerald-600' },
                                    { label: 'Password', icon: KeyRound, action: handleResetPassword, color: 'bg-white text-indigo-600' },
                                    { label: 'Edit', icon: Edit3, action: () => {}, color: 'bg-white text-slate-600' },
                                    { label: 'Delete', icon: Trash2, action: () => setShowDeleteDialog(true), color: 'bg-white text-red-500' },
                                ].map((btn, i) => (
                                    <button 
                                        key={i} 
                                        onClick={btn.action}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-3xl border border-slate-100 shadow-sm transition-all active:scale-90 ${btn.color}`}
                                    >
                                        <btn.icon size={20} />
                                        <span className="text-[9px] font-black uppercase tracking-tighter">{btn.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-8">
                                {selectedStudent.status === 'SUSPENDED' && selectedStudent.suspensionReason && (
                                    <div className="bg-red-50 border border-red-100 p-5 rounded-[28px] animate-in zoom-in duration-300">
                                        <div className="flex items-center gap-2 mb-2 text-red-600">
                                            <Info size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Suspension Details</span>
                                        </div>
                                        <p className="text-sm font-medium text-red-800 leading-relaxed italic">
                                            "{selectedStudent.suspensionReason}"
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <BarChart3 size={14} /> Academic Performance
                                        </h4>
                                        <span className="text-sm font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full flex items-center gap-1.5">
                                            <TrendingUp size={14} /> GPA {selectedStudent.gpa}
                                        </span>
                                    </div>
                                    <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                                        {selectedStudent.performance.length > 0 ? selectedStudent.performance.map((p, idx) => (
                                            <div key={idx}>
                                                <div className="flex justify-between mb-1.5 px-1">
                                                    <span className="text-xs font-bold text-slate-700">{p.subject}</span>
                                                    <span className={`text-xs font-black ${p.score >= 90 ? 'text-emerald-500' : 'text-slate-400'}`}>{p.grade} ({p.score}%)</span>
                                                </div>
                                                <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-1000 ${
                                                            p.score >= 90 ? 'bg-emerald-500' : p.score >= 80 ? 'bg-indigo-500' : 'bg-orange-400'
                                                        }`}
                                                        style={{ width: `${p.score}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-4 text-slate-300 italic text-xs">No grade records yet</div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-2 mb-3 text-emerald-500">
                                            <Activity size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-wider">Attendance</span>
                                        </div>
                                        <p className="text-2xl font-black text-slate-900">{selectedStudent.attendance}%</p>
                                        <p className="text-[9px] font-bold text-slate-400 mt-1">Status: Excellent</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-2 mb-3 text-indigo-500">
                                            <Calendar size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-wider">Since</span>
                                        </div>
                                        <p className="text-sm font-black text-slate-900">{selectedStudent.enrollmentDate.split(',')[1]}</p>
                                        <p className="text-[9px] font-bold text-slate-400 mt-1">Enrollment Date</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Users size={14} /> Profile Information
                                    </h4>
                                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
                                        {[
                                            { label: 'Parent / Guardian', value: selectedStudent.parentName || 'Not recorded', icon: Users },
                                            { label: 'Official Email', value: selectedStudent.email, icon: Mail },
                                            { label: 'Mobile Contact', value: selectedStudent.phone || 'N/A', icon: Phone },
                                            { label: 'Current Grade', value: `Grade ${selectedStudent.grade}-${selectedStudent.section}`, icon: GraduationCap },
                                        ].map((info, i) => (
                                            <div key={i} className="p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                                                <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                                    <info.icon size={18} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{info.label}</p>
                                                    <p className="text-xs font-bold text-slate-700 truncate">{info.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col gap-3">
                                    <button 
                                        onClick={() => setShowSuspendDialog(true)}
                                        disabled={selectedStudent.status === 'SUSPENDED'}
                                        className={`w-full py-4 font-black rounded-[24px] border flex items-center justify-center gap-2 transition-all uppercase text-[11px] tracking-widest ${
                                            selectedStudent.status === 'SUSPENDED'
                                            ? 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed'
                                            : 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100'
                                        }`}
                                    >
                                        <Ban size={18} />
                                        {selectedStudent.status === 'SUSPENDED' ? 'Account Suspended' : 'Revoke Portal Access'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Suspend Confirmation Dialog */}
            {showSuspendDialog && selectedStudent && (
                 <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white p-8 rounded-[40px] shadow-2xl max-w-sm w-full mx-6">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-6 mx-auto">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 text-center mb-2">Suspend Access?</h3>
                        <p className="text-xs text-slate-500 text-center mb-6 leading-relaxed">Please provide a reason for revoking {selectedStudent.name}'s portal access.</p>
                        
                        <div className="mb-8">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Suspension Reason</label>
                            <textarea 
                                value={suspensionInput}
                                onChange={(e) => setSuspensionInput(e.target.value)}
                                placeholder="e.g., Unpaid fees, Behavioral issues..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 h-24 resize-none"
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={handleSuspendStudent} 
                                className="w-full py-4 bg-amber-600 text-white font-black rounded-2xl hover:bg-amber-700 transition-colors"
                            >
                                Confirm Suspension
                            </button>
                            <button 
                                onClick={() => { setShowSuspendDialog(false); setSuspensionInput(''); }} 
                                className="w-full py-4 bg-slate-50 text-slate-600 font-black rounded-2xl hover:bg-slate-100 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && selectedStudent && (
                 <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white p-8 rounded-[40px] shadow-2xl max-w-sm w-full mx-6">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6 mx-auto">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 text-center mb-2">Delete Permanently?</h3>
                        <p className="text-xs text-slate-500 text-center mb-8 leading-relaxed">This action cannot be undone. All academic records for {selectedStudent.name} will be lost.</p>
                        <div className="flex flex-col gap-3">
                            <button onClick={handleDeleteStudent} className="w-full py-4 bg-red-600 text-white font-black rounded-2xl">Delete Record</button>
                            <button onClick={() => setShowDeleteDialog(false)} className="w-full py-4 bg-slate-50 text-slate-600 font-black rounded-2xl">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Tab Navigation */}
            <div className="absolute bottom-0 w-full bg-white border-t border-slate-100 p-2 pb-8 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center px-2 overflow-x-auto no-scrollbar gap-1">
                     {[
                        { id: 'DASHBOARD', icon: Home, label: 'Home' },
                        { id: 'STUDENTS', icon: Users, label: 'Students' },
                        { id: 'COURSES', icon: BookOpen, label: 'Courses' },
                        { id: 'FINANCE', icon: PieChart, label: 'Finance' },
                        { id: 'EXAMS', icon: Calendar, label: 'Exams' },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`flex flex-col items-center gap-1 min-w-[65px] p-2.5 rounded-2xl transition-all duration-300 ${activeTab === tab.id ? 'text-indigo-600 bg-indigo-50' : 'text-slate-300'}`}
                        >
                            <tab.icon size={22} strokeWidth={activeTab === tab.id ? 3 : 2} />
                            <span className={`text-[9px] font-black uppercase tracking-tighter ${activeTab === tab.id ? 'block' : 'hidden'}`}>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};