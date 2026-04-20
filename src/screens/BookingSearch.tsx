import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';
import VirtualKeyboard from '../components/VirtualKeyboard';
import { CLOUD_DATABASE_URL } from '../config';
import Ripple from '../components/Ripple';

const BookingSearch: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [bookingRef, setBookingRef] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showKeyboard, setShowKeyboard] = useState(true); // Default show keyboard

    const handleSearch = async () => {
        if (bookingRef.length === 0) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${CLOUD_DATABASE_URL}/api/check-booking`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_card: bookingRef })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (data.found) {
                navigate('/phone-input', { state: { booking: data.data } });
            } else {
                setError(data.message || t('booking_not_found') || 'Booking not found. Please try again.');
                setBookingRef('');
            }
        } catch (err) {
            setError('System error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.toUpperCase();
        setBookingRef(value);
    };

    const handleKeyPress = (key: string) => {
        if (key === 'ENTER') {
            setShowKeyboard(false);
            handleSearch();
            return;
        }

        if (key === 'BACKSPACE') {
            setBookingRef(prev => prev.slice(0, -1));
            setError(null);
            return;
        }

        if (key === 'SPACE') {
            return; // Ignore SPACE
        }

        // Default char handling
        setBookingRef(prev => {
            if (prev.length >= 20) return prev;

            // 1. Append new key
            let newVal = prev + key;

            // 2. FORCE UPPERCASE IMMEDIATELY
            newVal = newVal.toUpperCase();

            return newVal;
        });
        setError(null);
    };

    return (
        <Layout
            customBackButton={
                <button
                    onClick={() => navigate('/check-in-choice')}
                    className="relative overflow-hidden w-24 h-24 flex items-center justify-center text-gray-600 hover:text-blue-600 bg-slate-100 rounded-[2rem] shadow-neu-out active:shadow-neu-in transition-all z-50 pointer-events-auto"
                >
                    <Ripple />
                    <svg className="relative z-10 w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </button>
            }
        >
            <div className="w-full h-full bg-slate-100 flex flex-col relative p-10 pt-80 no-scrollbar overflow-y-auto">

                <div className={`flex-1 flex flex-col gap-10 px-10 pb-10 w-full max-w-5xl mx-auto items-center animate-fade-in-up transition-all duration-500 ${showKeyboard ? 'pb-96' : ''}`}>
                    <div className="w-full flex flex-col justify-start">
                        <div className="mb-10 text-center">
                            <h1 className="text-8xl font-bold text-gray-800 mb-6">{t('booking_search_title')}</h1>
                            <p className="text-5xl text-gray-500 leading-relaxed mb-10">{t('enter_booking_ref')}</p>
                        </div>

                        <div className={`bg-white rounded-[2rem] shadow-inner border-4 ${error ? 'border-red-500 shake' : 'border-gray-100'} p-12 w-full mb-10 flex items-center justify-center transition-all relative`}>
                            <input
                                type="text"
                                value={bookingRef}
                                onChange={handleChange}
                                onFocus={() => setShowKeyboard(true)}
                                placeholder={t('booking_no_placeholder')}
                                maxLength={20}
                                className={`w-full text-6xl text-center outline-none tracking-widest ${error ? 'text-red-500' : 'text-gray-800'} placeholder-gray-300 bg-transparent font-bold h-24`}
                            />
                            {bookingRef.length > 0 && (
                                <button
                                    onClick={() => setBookingRef('')}
                                    className="absolute right-8 text-gray-400 hover:text-red-500"
                                >
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            )}
                        </div>
                        {error && (
                            <p className="text-5xl text-red-500 font-bold text-center animate-bounce whitespace-pre-line leading-relaxed">{error}</p>
                        )}
                    </div>

                    <div className="w-full">
                        <button
                            onClick={handleSearch}
                            disabled={bookingRef.length === 0}
                            className={`
                            relative overflow-hidden w-full py-10 rounded-[2rem] text-5xl font-bold shadow-xl transition-all transform mb-10
                            ${bookingRef.length > 0
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-2xl'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                            `}
                        >
                            <Ripple />
                            <span className="relative z-10">{isLoading ? t('searching') : t('search')}</span>
                        </button>
                    </div>
                </div>

                {showKeyboard && (
                    <VirtualKeyboard
                        onKeyPress={handleKeyPress}
                        onClose={() => setShowKeyboard(false)}
                    />
                )}
            </div>
        </Layout>
    );
};

export default BookingSearch;
