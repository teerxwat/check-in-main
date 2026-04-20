import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import Ripple from '../components/Ripple';
import { CLOUD_DATABASE_URL } from '../config';





const CheckOutSearch: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [roomNo, setRoomNo] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (roomNo.length === 0) return;
        setError(null);

        try {
            const res = await fetch(`${CLOUD_DATABASE_URL}/api/search-checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ room_no: roomNo })
            });
            const json = await res.json();

            if (json.found) {
                navigate('/check-out-bill', { state: { booking: json.data } });
            } else {
                setError(json.message || "Room/Booking not found");
                setRoomNo('');
            }
        } catch (error) {
            console.error("Search Error:", error);
            setError(t('system_error'));
        }
    };

    return (
        <Layout
            showBackButton={true}
            onBack={() => navigate('/check-in-choice')}
        >
            <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center relative p-10 pt-80">

                <h1 className="text-7xl font-bold text-gray-800 mb-16">{t('checkout_search_title')}</h1>

                <div className="flex-1 flex flex-col gap-10 px-10 pb-10 w-full max-w-4xl mx-auto animate-fade-in-up">
                    <div className="flex-1 flex flex-col items-center justify-center w-full">
                        <p className="text-3xl text-gray-400 font-bold mb-8 uppercase tracking-widest text-center">{t('enter_room_number')}</p>

                        <div className="bg-white rounded-[2rem] shadow-inner border-4 border-gray-100 p-8 w-full mb-4 flex items-center justify-center relative">
                            <input
                                type="text"
                                value={roomNo}
                                onChange={(e) => setRoomNo(e.target.value)}
                                placeholder={t('room_no_placeholder')}
                                className="w-full text-7xl font-mono text-center outline-none tracking-[0.5em] text-gray-800 placeholder-gray-300 bg-transparent font-bold h-24"
                            />
                            {roomNo.length > 0 && (
                                <button
                                    onClick={() => setRoomNo('')}
                                    className="absolute right-8 text-gray-400 hover:text-red-500"
                                >
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>

                        <div className="h-12 mb-6 min-h-[3rem] flex items-center justify-center">
                            {error && (
                                <p className="text-red-500 text-3xl font-bold animate-pulse">{error}</p>
                            )}
                        </div>

                        {/* Numeric Keypad */}
                        <div className="w-full max-w-3xl mx-auto grid grid-cols-3 gap-6 mb-10">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => {
                                        if (roomNo.length < 5) setRoomNo(prev => prev + num);
                                        setError(null);
                                    }}
                                    className="h-32 relative overflow-hidden rounded-[2rem] bg-white shadow-neu-out text-6xl font-bold text-gray-700 hover:bg-gray-50 active:shadow-neu-in transition-all"
                                >
                                    <Ripple />
                                    {num}
                                </button>
                            ))}
                            <button
                                onClick={() => setRoomNo('')}
                                className="h-32 relative overflow-hidden rounded-[2rem] bg-red-50 shadow-neu-out text-3xl font-bold text-red-500 hover:bg-red-100 active:shadow-neu-in transition-all"
                            >
                                <Ripple />
                                CLEAR
                            </button>
                            <button
                                onClick={() => {
                                    if (roomNo.length < 5) setRoomNo(prev => prev + '0');
                                    setError(null);
                                }}
                                className="h-32 relative overflow-hidden rounded-[2rem] bg-white shadow-neu-out text-6xl font-bold text-gray-700 hover:bg-gray-50 active:shadow-neu-in transition-all"
                            >
                                <Ripple />
                                0
                            </button>
                            <button
                                onClick={() => setRoomNo(prev => prev.slice(0, -1))}
                                className="h-32 relative overflow-hidden rounded-[2rem] bg-slate-100 shadow-neu-out text-gray-600 hover:text-red-500 active:shadow-neu-in transition-all flex items-center justify-center"
                            >
                                <Ripple />
                                <svg className="w-12 h-12 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" /></svg>
                            </button>
                        </div>

                        <div className="w-full mt-10">
                            <button
                                onClick={handleSearch}
                                disabled={roomNo.length === 0}
                                className={`
                                relative overflow-hidden h-24 rounded-[2rem] w-full shadow-xl text-3xl font-bold border transform hover:scale-105 transition-all
                                ${roomNo.length > 0 ? 'bg-orange-500 text-white hover:bg-orange-600 border-orange-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed border-transparent'}
                            `}
                            >
                                <Ripple />
                                <span className="relative z-10">GO</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CheckOutSearch;
