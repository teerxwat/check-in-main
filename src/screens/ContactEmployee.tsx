import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import Ripple from '../components/Ripple';
import { LOCAL_HARDWARE_URL } from '../config';

type CallState = 'idle' | 'dialing' | 'connected' | 'busy' | 'hangup' | 'disconnect';

const ContactEmployee: React.FC = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [callState, setCallState] = useState<CallState>('idle');
    const [callDuration, setCallDuration] = useState(0);

    const initiateCall = async () => {
        setCallState('dialing');
        setCallDuration(0);
        try {
            await fetch(`${LOCAL_HARDWARE_URL}/api/call`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: "0955677876" })
            });
        } catch (error) {
            console.error("GSM API fetch setup error:", error);
            setCallState('idle');
        }
    };

    // Polling for Call Status
    useEffect(() => {
        let pollInterval: ReturnType<typeof setInterval>;

        if (callState !== 'idle') {
            pollInterval = setInterval(async () => {
                try {
                    const response = await fetch(`${LOCAL_HARDWARE_URL}/api/call-status`);
                    const data = await response.json();

                    if (data.status === 'begin' && callState !== 'connected') {
                        setCallState('connected');
                    } else if (['busy', 'disconnect', 'hangup'].includes(data.status) && callState !== data.status) {
                        setCallState(data.status as CallState);
                        // Auto close after 3 seconds of showing the target error/end message
                        setTimeout(() => {
                            setCallState('idle');
                            navigate(-1);
                        }, 3000);
                    }
                } catch (e) {
                    console.error("Error polling status:", e);
                }
            }, 1000); // Poll every 1 second
        }

        return () => clearInterval(pollInterval);
    }, [callState, navigate]);

    // Timer for connected state
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (callState === 'connected') {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [callState]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleEndCall = async () => {
        if (callState === 'connected' || callState === 'dialing') {
            try {
                await fetch(`${LOCAL_HARDWARE_URL}/api/hangup`, { method: 'POST' });
            } catch (e) {
                console.error("Error hanging up:", e);
            }
        }
        navigate(-1);
    };

    return (
        <Layout showBackButton={false} showHomeButton={false} showGlobalLogo={false}>
            <div className="w-full h-full flex-grow z-50 bg-slate-900 flex flex-col items-center justify-between p-10 pt-32 pb-24 text-white">

                {/* Top Section: Avatar & Status */}
                <div className="flex flex-col items-center animate-fade-in-down w-full mt-24">
                    <h1 className="text-7xl font-light text-gray-200 mb-12">
                        {language === 'TH' ? 'พนักงานต้อนรับ' : 'Receptionist'}
                    </h1>

                    {/* Avatar with pulsing effect when dialing */}
                    <div className="relative flex items-center justify-center mb-16 h-80 w-80">
                        {callState === 'dialing' && (
                            <>
                                <div className="absolute w-80 h-80 bg-slate-700 rounded-full animate-ping opacity-20"></div>
                                <div className="absolute w-96 h-96 bg-slate-700 rounded-full animate-ping opacity-10" style={{ animationDelay: '0.2s' }}></div>
                            </>
                        )}
                        <div className="absolute w-64 h-64 bg-slate-700 rounded-full flex items-center justify-center z-10 shadow-2xl border-4 border-slate-600">
                            <svg className="w-32 h-32 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    </div>

                    <div className="text-5xl text-gray-400 font-light h-12">
                        {callState === 'idle' && (language === 'TH' ? 'พร้อมติดต่อพนักงาน' : 'Ready to call')}
                        {callState === 'dialing' && (language === 'TH' ? 'กำลังค้นหาสัญญาณ...' : 'Dialing...')}
                        {callState === 'connected' && formatTime(callDuration)}
                        {callState === 'busy' && (language === 'TH' ? 'สายไม่ว่าง' : 'Line Busy')}
                        {callState === 'hangup' && (language === 'TH' ? 'วางสายแล้ว' : 'Call Ended')}
                        {callState === 'disconnect' && (language === 'TH' ? 'พนักงานวางสาย' : 'Disconnected')}
                    </div>
                </div>

                {/* Bottom Section: Controls */}
                <div className="flex flex-row items-center justify-center w-full gap-24 mb-32 animate-fade-in-up">

                    {callState === 'idle' ? (
                        <>
                            {/* Cancel Button */}
                            <button
                                onClick={handleEndCall}
                                className="relative overflow-hidden w-36 h-36 bg-slate-600 rounded-full flex items-center justify-center shadow-lg hover:bg-slate-500 active:scale-95 transition-all text-white"
                            >
                                <Ripple color="rgba(255,255,255,0.2)" />
                                <svg className="relative z-10 w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>

                            {/* Start Call Button */}
                            <button
                                onClick={initiateCall}
                                className="relative overflow-hidden w-48 h-48 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-400 active:scale-95 transition-all outline-none"
                            >
                                <Ripple color="rgba(255,255,255,0.3)" />
                                <svg className="relative z-10 w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                </svg>
                            </button>
                        </>
                    ) : (
                        /* End Call Button */
                        <button
                            onClick={handleEndCall}
                            className="relative overflow-hidden w-48 h-48 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-400 active:scale-95 transition-all"
                        >
                            <Ripple color="rgba(255,255,255,0.3)" />
                            <svg className="relative z-10 w-24 h-24 text-white transform rotate-[135deg]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                            </svg>
                        </button>
                    )}

                </div>
            </div>
        </Layout>
    );
};

export default ContactEmployee;
