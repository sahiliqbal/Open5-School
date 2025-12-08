import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Welcome } from './components/Welcome';
import { Login } from './components/Login';
import { RoleSelection } from './components/RoleSelection';
import { Home } from './components/Home';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CourseDetail } from './components/CourseDetail';
import { ScreenState, Course, UserRole } from './types';
import { MOCK_COURSES } from './constants';

const App: React.FC = () => {
    // Initialize Onboarding state from localStorage
    const [isOnboarded, setIsOnboarded] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('open5_isOnboarded') === 'true';
        }
        return false;
    });

    // Initialize Screen/Session state from localStorage
    const [screen, setScreen] = useState<ScreenState>(() => {
        if (typeof window !== 'undefined') {
            const savedScreen = localStorage.getItem('open5_screen');
            if (savedScreen) {
                const parsed = parseInt(savedScreen);
                // If saved state was details, revert to home as we don't persist selectedCourse yet
                if (parsed === ScreenState.STUDENT_DETAILS) return ScreenState.STUDENT_HOME;
                return parsed;
            }
        }
        return ScreenState.ROLE_SELECTION;
    });

    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem('open5_isOnboarded', String(isOnboarded));
    }, [isOnboarded]);

    useEffect(() => {
        localStorage.setItem('open5_screen', screen.toString());
    }, [screen]);

    const handleOnboardingComplete = () => {
        setIsOnboarded(true);
        // After onboarding, go to Welcome Screen
        setScreen(ScreenState.WELCOME);
    };

    const handleWelcomeLogin = () => {
        setScreen(ScreenState.LOGIN);
    };

    const handleLoginSuccess = () => {
        // After Login, go to Role Selection to pick portal
        setScreen(ScreenState.ROLE_SELECTION);
    };

    const handleRoleSelect = (role: UserRole) => {
        switch (role) {
            case 'STUDENT':
                setScreen(ScreenState.STUDENT_HOME);
                break;
            case 'TEACHER':
                setScreen(ScreenState.TEACHER_DASHBOARD);
                break;
            case 'ADMIN':
                setScreen(ScreenState.ADMIN_DASHBOARD);
                break;
        }
    };

    const handleLogout = () => {
        setScreen(ScreenState.WELCOME);
        setSelectedCourse(null);
        // We purposefully don't clear isOnboarded on logout
    };

    const handleSelectCourse = (course: Course) => {
        setSelectedCourse(course);
        setScreen(ScreenState.STUDENT_DETAILS);
    };

    const handleBackFromDetails = () => {
        setScreen(ScreenState.STUDENT_HOME);
        setSelectedCourse(null);
    };

    // Initial check for onboarding
    if (!isOnboarded) {
        return <Onboarding onStart={handleOnboardingComplete} />;
    }

    return (
        <div className="w-full mx-auto bg-white shadow-2xl min-h-screen relative overflow-hidden font-sans sm:max-w-5xl sm:my-8 sm:rounded-[32px] sm:border-[8px] sm:border-slate-800">
            {/* Desktop Mockup Border Adjustment wrapper could go here, keeping it simple for now */}
            
            {screen === ScreenState.WELCOME && (
                <Welcome 
                    onLogin={handleWelcomeLogin} 
                    onSignUp={handleWelcomeLogin} 
                />
            )}

            {screen === ScreenState.LOGIN && (
                <Login 
                    onSuccess={handleLoginSuccess} 
                    onBack={() => setScreen(ScreenState.WELCOME)} 
                />
            )}

            {screen === ScreenState.ROLE_SELECTION && (
                <RoleSelection onSelectRole={handleRoleSelect} />
            )}

            {screen === ScreenState.STUDENT_HOME && (
                <Home 
                    courses={MOCK_COURSES} 
                    onSelectCourse={handleSelectCourse}
                    onLogout={handleLogout}
                />
            )}
            
            {screen === ScreenState.STUDENT_DETAILS && selectedCourse && (
                <CourseDetail 
                    course={selectedCourse} 
                    onBack={handleBackFromDetails} 
                />
            )}

            {screen === ScreenState.TEACHER_DASHBOARD && (
                <TeacherDashboard onLogout={handleLogout} />
            )}

            {screen === ScreenState.ADMIN_DASHBOARD && (
                <AdminDashboard onLogout={handleLogout} />
            )}
        </div>
    );
};

export default App;