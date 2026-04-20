import React, { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import Ripple from './Ripple';

interface LayoutProps {
    children: ReactNode;
    showBackButton?: boolean;
    onBack?: () => void;
    showHomeButton?: boolean;
    showGlobalLogo?: boolean;
    customBackButton?: ReactNode; // New prop for screens to pass their custom back button
}

const Layout: React.FC<LayoutProps> = ({ children, showBackButton, onBack, showHomeButton = true, showGlobalLogo = true, customBackButton }) => {
    const navigate = useNavigate();
    const getInitialScale = () => window.innerHeight / 1920;
    const getInitialWidth = () => window.innerWidth / (window.innerHeight / 1920);

    const [scale, setScale] = useState(getInitialScale);
    const [virtualDimensions, setVirtualDimensions] = useState({ width: getInitialWidth(), height: 1920 });
    const location = useLocation();

    // Idle Timeout Logic
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        const resetTimer = () => {
            // Don't timeout if we are already on the idle screen
            if (location.pathname !== '/idle') {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    navigate('/idle');
                }, 150000); // 150 seconds (2.5 minutes)
            }
        };

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

        if (location.pathname !== '/idle') {
            events.forEach(event => document.addEventListener(event, resetTimer));
            resetTimer(); // Start timer initially
        }

        return () => {
            clearTimeout(timeout);
            events.forEach(event => document.removeEventListener(event, resetTimer));
        };
    }, [location.pathname, navigate]);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Since this runs on a TV, we want the app to always touch the top/bottom (1920 height scaled)
            // and dynamically expand horizontally to completely fill the side margins.
            const newScale = height / 1920;

            setScale(newScale);
            setVirtualDimensions({
                width: width / newScale, // Dynamically set virtual width based on physical screen
                height: 1920             // Fixed virtual height
            });
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="w-screen h-screen bg-slate-100 overflow-hidden flex items-center justify-center select-none p-0 m-0">
            <style>{`
                img { user-select: none; -webkit-user-drag: none; pointer-events: none; }
                button img, a img { pointer-events: auto; }
            `}</style>

            {/* 
              The scaled container uses the dynamically calculated virtual width.
              By matching height to 1920 and width to the required aspect ratio, 
              it guarantees no letterboxing on any screen size.
            */}
            <div
                className="absolute top-1/2 left-1/2 bg-slate-100 text-slate-900 overflow-hidden flex flex-col"
                style={{
                    width: `${virtualDimensions.width}px`,
                    height: `${virtualDimensions.height}px`,
                    transform: `translate(-50%, -50%) scale(${scale})`,
                }}
            >
                {children}

                {/* Header Container */}
                <div className="absolute top-24 left-0 w-full px-10 flex items-center justify-between z-20 pointer-events-none">
                    {/* Left: Back Button or Spacer */}
                    <div className="w-48 flex justify-start pointer-events-auto">
                        {customBackButton ? customBackButton : (
                            showBackButton && onBack && (
                                <button
                                    onClick={onBack}
                                    className="relative overflow-hidden w-24 h-24 flex items-center justify-center text-gray-600 hover:text-blue-600 bg-slate-100 rounded-[2rem] shadow-neu-out active:shadow-neu-in transition-all"
                                >
                                    <Ripple />
                                    <svg className="relative z-10 w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                            )
                        )}
                    </div>

                    {/* Center: Global Logo */}
                    {showGlobalLogo && (
                        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto flex items-center justify-center">
                            <Logo className="w-64 h-auto object-contain" />
                        </div>
                    )}

                    {/* Right: Home Button or Spacer */}
                    <div className="w-48 flex justify-end pointer-events-auto">
                        {showHomeButton && (
                            <button
                                onClick={() => navigate('/')}
                                className="relative overflow-hidden flex items-center gap-4 text-gray-600 hover:text-blue-600 p-8 bg-slate-100 rounded-[2rem] shadow-neu-out active:shadow-neu-in transition-all"
                            >
                                <Ripple />
                                <svg className="relative z-10 w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Layout;
