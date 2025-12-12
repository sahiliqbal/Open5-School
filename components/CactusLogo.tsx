import React from 'react';

interface CactusLogoProps {
    className?: string;
    size?: number;
    withText?: boolean;
}

export const CactusLogo: React.FC<CactusLogoProps> = ({ className = "", size = 64, withText = false }) => {
    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <svg 
                width={size} 
                height={size} 
                viewBox="0 0 200 200" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-sm"
            >
                <defs>
                    <linearGradient id="logoGradient" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#FB923C" /> {/* Orange 400 */}
                        <stop offset="100%" stopColor="#DC2626" /> {/* Red 600 */}
                    </linearGradient>
                </defs>

                {/* Abstract X / Helix Shape representing Open5 */}
                {/* Stroke 1: Top-Left to Bottom-Right */}
                <path 
                    d="M 60 50 C 60 50, 100 100, 140 150" 
                    stroke="url(#logoGradient)" 
                    strokeWidth="28" 
                    strokeLinecap="round"
                />
                
                {/* Stroke 2: Top-Right to Bottom-Left */}
                <path 
                    d="M 140 50 C 140 50, 100 100, 60 150" 
                    stroke="url(#logoGradient)" 
                    strokeWidth="28" 
                    strokeLinecap="round" 
                />
            </svg>
            
            {withText && (
                <div className="mt-2 text-center flex items-center gap-0.5 justify-center">
                    <span className="text-3xl font-bold text-[#F97316] tracking-tight">Open</span>
                    <span className="text-3xl font-bold text-[#DC2626] tracking-tight">5</span>
                </div>
            )}
        </div>
    );
};