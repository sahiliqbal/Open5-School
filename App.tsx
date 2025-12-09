import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Welcome } from './components/Welcome';
import { Login } from './components/Login';
import { RoleSelection } from './components/RoleSelection';
import { Home } from './components/Home';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CourseDetail } from './components/CourseDetail';
import { ScreenState, Course } from './types';
import { MOCK_COURSES } from './constants';

const App: React.FC = () => {
    // Robust State Initialization with Error Handling
    const [isOnboarded, setIsOnboarded] = useState(() => {
        try {
            if (typeof window !== 'undefined') {
                return localStorage.getItem('open5_isOnboarded') === 'true';
            }
        } catch (e) { console.error(e); }
        return false;
    });

    const [screen, setScreen] = useState<ScreenState>(() => {
        try {
            if (typeof window !== 'undefined') {
                const savedScreen = localStorage.getItem('open5_screen');
                if (savedScreen) {
                    const parsed = parseInt(savedScreen);
                    if (!isNaN(parsed)) {
                         // Fallback for detail view refresh to prevent stuck states
                        if (parsed === ScreenState.STUDENT_DETAILS) return ScreenState.STUDENT_HOME;
                        return parsed;
                    }
                }
            }
        } catch (e) { console.error(e); }
        return ScreenState.ROLE_SELECTION;
    });

    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    // Persistence Effects
    useEffect(() => {
        try {
            localStorage.setItem('open5_isOnboarded', String(isOnboarded));
        } catch (e) {}
    }, [isOnboarded]);

    useEffect(() => {
        try {
            localStorage.setItem('open5_screen', screen.toString());
        } catch (e) {}
    }, [screen]);

    const handleOnboardingComplete = () => {
        setIsOnboarded(true);
        setScreen(ScreenState.WELCOME);
    };

    const handleLogout = () => {
        setScreen(ScreenState.WELCOME);
        setSelectedCourse(null);
    };

    // Routing Logic
    const renderScreen = () => {
        switch (screen) {
            case ScreenState.WELCOME:
                return <Welcome onLogin={() => setScreen(ScreenState.LOGIN)} onSignUp={() => setScreen(ScreenState.LOGIN)} />;
            case ScreenState.LOGIN:
                return <Login 
                    onSuccess={() => setScreen(ScreenState.ROLE_SELECTION)} 
                    onStudentLogin={() => setScreen(ScreenState.STUDENT_HOME)}
                    onBack={() => setScreen(ScreenState.WELCOME)} 
                />;
            case ScreenState.ROLE_SELECTION:
                return <RoleSelection onSelectRole={(role) => {
                    if (role === 'STUDENT') setScreen(ScreenState.STUDENT_HOME);
                    if (role === 'TEACHER') setScreen(ScreenState.TEACHER_DASHBOARD);
                    if (role === 'ADMIN') setScreen(ScreenState.ADMIN_DASHBOARD);
                }} />;
            case ScreenState.STUDENT_HOME:
                return <Home courses={MOCK_COURSES} onSelectCourse={(c) => { setSelectedCourse(c); setScreen(ScreenState.STUDENT_DETAILS); }} onLogout={handleLogout} />;
            case ScreenState.STUDENT_DETAILS:
                return selectedCourse ? <CourseDetail course={selectedCourse} onBack={() => { setSelectedCourse(null); setScreen(ScreenState.STUDENT_HOME); }} /> : <Home courses={MOCK_COURSES} onSelectCourse={(c) => { setSelectedCourse(c); setScreen(ScreenState.STUDENT_DETAILS); }} onLogout={handleLogout} />;
            case ScreenState.TEACHER_DASHBOARD:
                return <TeacherDashboard onLogout={handleLogout} />;
            case ScreenState.ADMIN_DASHBOARD:
                return <AdminDashboard onLogout={handleLogout} />;
            default:
                return <RoleSelection onSelectRole={(role) => setScreen(ScreenState.STUDENT_HOME)} />;
        }
    };

    if (!isOnboarded) {
        return <Onboarding onStart={handleOnboardingComplete} />;
    }

    return (
        <div className="flex justify-center min-h-[100dvh] bg-slate-200 sm:py-8 font-sans">
            {/* Main App Container - Simulates a Mobile Device Frame on Desktop */}
            <div className="w-full sm:max-w-[480px] md:max-w-[500px] lg:max-w-[1024px] bg-slate-50 sm:rounded-[32px] sm:shadow-2xl overflow-hidden relative border-x border-slate-200 sm:border-y h-[100dvh] sm:h-[850px] flex flex-col">
                {renderScreen()}
            </div>
        </div>
    );
};

export default App;