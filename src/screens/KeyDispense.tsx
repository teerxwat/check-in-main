import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import Ripple from '../components/Ripple';
import { LOCAL_HARDWARE_URL } from '../config';

const KeyDispense: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const [step, setStep] = useState(0);

    const booking = (location.state as any)?.booking;
    const selectedRoom = (location.state as any)?.selectedRoom;

    useEffect(() => {
        const dispenseKey = async () => {
            try {
                // Check both existing booking and new walk-in room selection
                const roomTypeId = booking?.room_type_id || selectedRoom?.room_type_id || 1;

                // Map database room type IDs (1001, 1002, 1003) to motor commands (1, 2, 3)
                let dispenseId = Number(roomTypeId);
                if (dispenseId === 1001) dispenseId = 1;
                else if (dispenseId === 1002) dispenseId = 2;
                else if (dispenseId === 1003) dispenseId = 3;

                // Safety fallback if ID is completely unrecognized
                if (![1, 2, 3].includes(dispenseId)) {
                    console.warn(`Unknown roomTypeId ${roomTypeId}, defaulting to 1`);
                    dispenseId = 1;
                }

                console.log(`Sending dispense command for room type: ${dispenseId} (Original: ${roomTypeId})`);

                await fetch(`${LOCAL_HARDWARE_URL}/api/dispense-key`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ room_type_id: dispenseId })
                });
            } catch (error) {
                console.error("Failed to send dispense key command:", error);
            }
        };

        const t1 = setTimeout(() => setStep(1), 2000);
        const t2 = setTimeout(() => {
            setStep(2);
            dispenseKey(); // Trigger the motor when the animation shows "Take Key"
        }, 4000);

        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [booking]);

    const handleFinish = () => {
        navigate('/');
    };

    return (
        <Layout showHomeButton={false}>
            <div className="w-full h-full bg-blue-900 flex flex-col items-center justify-center relative p-10 overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-800 to-blue-950"></div>

                <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">

                    {step < 2 ? (
                        <>
                            <div className="w-96 h-64 bg-white rounded-3xl shadow-2xl relative mb-20 animate-bounce flex items-center justify-center">
                                <div className="absolute inset-4 border-4 border-blue-100 rounded-2xl"></div>
                                <svg className="w-32 h-32 text-blue-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>
                            </div>

                            <h2 className="text-6xl font-bold text-white mb-8">
                                {step === 0 ? t('encoding_key') : t('dispensing_key')}
                            </h2>
                            <div className="flex gap-4">
                                <div className="w-6 h-6 bg-white rounded-full animate-bounce delay-0"></div>
                                <div className="w-6 h-6 bg-white rounded-full animate-bounce delay-100"></div>
                                <div className="w-6 h-6 bg-white rounded-full animate-bounce delay-200"></div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center animate-fade-in-up">
                            <div className="w-48 h-48 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.6)] mb-16 animate-pulse">
                                <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>

                            <h2 className="text-7xl font-bold text-white mb-8">{t('check_in_complete')}</h2>
                            <p className="text-blue-200 text-4xl mb-20 max-w-4xl leading-relaxed">{t('take_key')}</p>

                            <button
                                onClick={handleFinish}
                                className="relative overflow-hidden bg-white text-blue-900 px-20 py-8 rounded-full text-4xl font-bold shadow-xl hover:bg-blue-50 hover:scale-105 transition-all"
                            >
                                <Ripple />
                                <span className="relative z-10">{t('back_home')}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default KeyDispense;
