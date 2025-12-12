import React, { useState } from 'react';
import { LogOut, Bell, Home, PieChart, Users, Calendar, Package, Plus, UserCog, MessageSquare, BookOpen, Search, Filter, Ban, CheckCircle, Activity, Award, Mail, Phone, X, AlertTriangle } from 'lucide-react';
import { MOCK_COURSES } from '../constants';

interface AdminDashboardProps {
    onLogout: () => void;
}

type Tab = 'DASHBOARD' | 'COURSES' | 'FINANCE' | 'EXAMS' | 'STUDENTS' | 'INVENTORY';

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
    enrollmentDate: string;
}

const MOCK_STUDENTS_DATA: StudentProfile[] = [
    { id: '1', name: 'Alex Johnson', rollNo: '2451', email: 'alex.j@school.edu', grade: '12', section: 'A', status: 'ACTIVE', gpa: 3.8, attendance: 95, avatarSeed: 'Alex', phone: '+1 234 567 890', enrollmentDate: 'Aug 15, 2021' },
    { id: '2', name: 'Sam Smith', rollNo: '2452', email: 'sam.s@school.edu', grade: '11', section: 'B', status: 'SUSPENDED', gpa: 2.4, attendance: 60, avatarSeed: 'Sam', phone: '+1 987 654 321', enrollmentDate: 'Aug 20, 2022' },
    { id: '3', name: 'Jordan Lee', rollNo: '2453', email: 'jordan.l@school.edu', grade: '10', section: 'A', status: 'ACTIVE', gpa: 3.9, attendance: 98, avatarSeed: 'Jordan', phone: '+1 555 123 456', enrollmentDate: 'Sep 01, 2023' },
    { id: '4', name: 'Casey West', rollNo: '2454', email: 'casey.w@school.edu', grade: '12', section: 'C', status: 'ACTIVE', gpa: 3.2, attendance: 88, avatarSeed: 'Casey', phone: '+1 444 777 888', enrollmentDate: 'Aug 15, 2021' },
    { id: '5', name: 'Taylor Swift', rollNo: '2455', email: 'taylor.s@school.edu', grade: '12', section: 'A', status: 'ALUMNI', gpa: 4.0, attendance: 100, avatarSeed: 'Taylor', phone: '+1 222 333 444', enrollmentDate: 'Aug 10, 2020' },
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');
    
    // Student Module State
    const [students, setStudents] = useState<StudentProfile[]>(MOCK_STUDENTS_DATA);
    const [studentSearch, setStudentSearch] = useState('');
    const [studentFilter, setStudentFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');
    const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
    const [showSuspendDialog, setShowSuspendDialog] = useState(false);

    const filteredStudents = students.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.rollNo.includes(studentSearch);
        const matchesFilter = studentFilter === 'ALL' || s.status === studentFilter;
        return matchesSearch && matchesFilter;
    });

    const handleSuspendStudent = () => {
        if (!selectedStudent) return;
        
        const updatedStudents = students.map(s => 
            s.id === selectedStudent.id 
                ? { ...s, status: 'SUSPENDED' as const } 
                : s
        );
        
        setStudents(updatedStudents);
        // Update local selected state to reflect change immediately
        setSelectedStudent({ ...selectedStudent, status: 'SUSPENDED' });
        setShowSuspendDialog(false);
    };

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
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="grid grid-cols-2 gap-4">
                            <StatCard label="Students" value={students.length.toLocaleString()} color="bg-orange-500" />
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
                    <div className="space-y-4 animate-in fade-in duration-300">
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
            case 'STUDENTS':
                return (
                    <div className="space-y-4 pb-24 animate-in fade-in duration-300">
                        {/* Header & Search */}
                        <div className="sticky top-0 bg-slate-50 z-10 pb-2 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 text-lg">Student Directory</h3>
                                <button className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                                    <Plus size={20} />
                                </button>
                            </div>
                            
                            <div className="flex gap-2">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Search by name or roll no..." 
                                        value={studentSearch}
                                        onChange={(e) => setStudentSearch(e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-[16px] py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                </div>
                                <button className="w-12 h-12 bg-white border border-slate-200 rounded-[16px] flex items-center justify-center text-slate-500">
                                    <Filter size={20} />
                                </button>
                            </div>

                            {/* Status Filter Tabs */}
                            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                {['ALL', 'ACTIVE', 'SUSPENDED'].map((filter) => (
                                    <button 
                                        key={filter}
                                        onClick={() => setStudentFilter(filter as any)}
                                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                                            studentFilter === filter 
                                            ? 'bg-slate-900 text-white' 
                                            : 'bg-white text-slate-500 border border-slate-200'
                                        }`}
                                    >
                                        {filter.charAt(0) + filter.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* List */}
                        <div className="space-y-3">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <div 
                                        key={student.id} 
                                        onClick={() => setSelectedStudent(student)}
                                        className="bg-white p-4 rounded-[24px] border border-slate-100 flex items-center justify-between active:scale-[0.98] transition-all hover:shadow-md cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden">
                                                <img 
                                                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${student.avatarSeed}`} 
                                                    alt={student.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{student.name}</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-400 font-medium">#{student.rollNo}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                    <span className="text-xs text-slate-400 font-medium">Class {student.grade}-{student.section}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide border ${
                                                student.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                student.status === 'SUSPENDED' ? 'bg-red-50 text-red-600 border-red-100' :
                                                'bg-slate-100 text-slate-500 border-slate-200'
                                            }`}>
                                                {student.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                                        <Search size={24} />
                                    </div>
                                    <p className="text-slate-500 font-medium text-sm">No students found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 animate-in fade-in zoom-in duration-300">
                        <Package size={48} className="mb-4 opacity-50" />
                        <p className="font-bold">Module Under Construction</p>
                    </div>
                );
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

            {/* Student Detail Modal */}
            {selectedStudent && (
                <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full h-[90%] sm:h-auto sm:max-h-[85vh] rounded-t-[40px] sm:rounded-[40px] shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden m-0 sm:m-4">
                        {/* Modal Header */}
                        <div className="relative h-32 bg-slate-900 shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50"></div>
                            <button 
                                onClick={() => setSelectedStudent(null)} 
                                className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors z-10"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        {/* Profile Content */}
                        <div className="flex-1 overflow-y-auto bg-slate-50 relative -mt-12 rounded-t-[32px] pt-0">
                            <div className="px-8 pb-8">
                                {/* Avatar & Identity */}
                                <div className="flex justify-between items-end mb-6 relative -top-10">
                                    <div className="w-24 h-24 bg-white p-1.5 rounded-[24px] shadow-lg">
                                        <img 
                                            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedStudent.avatarSeed}`} 
                                            alt={selectedStudent.name}
                                            className="w-full h-full bg-slate-100 rounded-[18px] object-cover"
                                        />
                                    </div>
                                    <div className="mb-2 flex gap-2">
                                        <button 
                                            onClick={() => window.location.href = `mailto:${selectedStudent.email}`}
                                            className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
                                        >
                                            <Mail size={18} />
                                        </button>
                                        <button 
                                            onClick={() => window.location.href = `tel:${selectedStudent.phone}`}
                                            className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all"
                                        >
                                            <Phone size={18} />
                                        </button>
                                        <button className="p-2.5 bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-300 active:scale-95 transition-all">
                                            <UserCog size={18} />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="-mt-8 mb-8">
                                    <h2 className="text-2xl font-bold text-slate-900 leading-tight">{selectedStudent.name}</h2>
                                    <p className="text-slate-500 font-medium">Student ID: {selectedStudent.rollNo}</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${
                                            selectedStudent.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                            selectedStudent.status === 'SUSPENDED' ? 'bg-red-100 text-red-700 border-red-200' :
                                            'bg-slate-100 text-slate-500 border-slate-200'
                                        }`}>
                                            {selectedStudent.status}
                                        </span>
                                        <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wide">
                                            Class {selectedStudent.grade}-{selectedStudent.section}
                                        </span>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-white p-4 rounded-[20px] shadow-sm border border-slate-100">
                                        <div className="flex items-center gap-2 mb-2 text-indigo-500">
                                            <Award size={18} />
                                            <span className="text-xs font-bold uppercase tracking-wide">GPA</span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900">{selectedStudent.gpa}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Last Semester</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-[20px] shadow-sm border border-slate-100">
                                        <div className="flex items-center gap-2 mb-2 text-emerald-500">
                                            <Activity size={18} />
                                            <span className="text-xs font-bold uppercase tracking-wide">Attendance</span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900">{selectedStudent.attendance}%</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Year to date</p>
                                    </div>
                                </div>

                                {/* Details List */}
                                <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="p-4 border-b border-slate-50 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Mail size={14}/></div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase">Email</p>
                                                <p className="text-sm font-semibold text-slate-700">{selectedStudent.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 border-b border-slate-50 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Phone size={14}/></div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase">Phone</p>
                                                <p className="text-sm font-semibold text-slate-700">{selectedStudent.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><Calendar size={14}/></div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase">Enrolled</p>
                                                <p className="text-sm font-semibold text-slate-700">{selectedStudent.enrollmentDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Danger Zone */}
                                <div className="mt-8 pt-6 border-t border-slate-200">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">Management</h4>
                                    <button 
                                        onClick={() => setShowSuspendDialog(true)}
                                        disabled={selectedStudent.status === 'SUSPENDED'}
                                        className={`w-full py-3 font-bold rounded-[16px] border flex items-center justify-center gap-2 transition-colors ${
                                            selectedStudent.status === 'SUSPENDED'
                                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                            : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'
                                        }`}
                                    >
                                        <Ban size={18} />
                                        {selectedStudent.status === 'SUSPENDED' ? 'Account Suspended' : 'Suspend Student Account'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Suspend Confirmation Dialog */}
            {showSuspendDialog && selectedStudent && (
                 <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white p-6 rounded-[24px] shadow-2xl max-w-sm w-full mx-6 animate-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4 mx-auto">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Suspend Account?</h3>
                        <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
                            Are you sure you want to suspend <span className="font-bold text-slate-800">{selectedStudent.name}</span>? They will lose access to the portal immediately.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowSuspendDialog(false)}
                                className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSuspendStudent}
                                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-200 hover:bg-red-600 transition-colors"
                            >
                                Suspend
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute bottom-0 w-full bg-white border-t border-slate-100 p-2 pb-6 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center px-4 overflow-x-auto no-scrollbar gap-2">
                     {[
                        { id: 'DASHBOARD', icon: Home, label: 'Home' },
                        { id: 'COURSES', icon: BookOpen, label: 'Courses' },
                        { id: 'FINANCE', icon: PieChart, label: 'Finance' },
                        { id: 'EXAMS', icon: Calendar, label: 'Exams' },
                        { id: 'STUDENTS', icon: Users, label: 'Students' },
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